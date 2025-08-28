
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Shield, User, Mail, Calendar } from "lucide-react"
import { getUsers, updateUserRole } from "@/lib/firebase/users"
import type { User } from "@/lib/types"

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const usersData = await getUsers()
      setUsers(usersData)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, isAdmin: boolean) => {
    try {
      await updateUserRole(userId, isAdmin)
      await loadUsers()
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error)
    }
  }

  const filteredUsers = users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div>Carregando usuários...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback>
                      {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium">{user.displayName || "Nome não informado"}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      Membro desde {user.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {user.isAdmin ? (
                    <Badge className="bg-green-500 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <User className="w-3 h-3 mr-1" />
                      Cliente
                    </Badge>
                  )}
                  
                  <Button
                    variant={user.isAdmin ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleRoleChange(user.id, !user.isAdmin)}
                  >
                    {user.isAdmin ? "Remover Admin" : "Tornar Admin"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
        </div>
      )}
    </div>
  )
}

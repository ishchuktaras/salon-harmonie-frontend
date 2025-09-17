"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Edit, Trash2, Search } from "lucide-react"
import { UserRole } from "@/lib/api/types"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  createdAt: string
  isActive: boolean
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // Mock data for demonstration
  useEffect(() => {
    setEmployees([
      {
        id: "1",
        firstName: "Jan",
        lastName: "Novák",
        email: "jan.novak@salon.cz",
        role: UserRole.TERAPEUT,
        createdAt: "2024-01-15",
        isActive: true,
      },
      {
        id: "2",
        firstName: "Marie",
        lastName: "Svobodová",
        email: "marie.svobodova@salon.cz",
        role: UserRole.RECEPCNI,
        createdAt: "2024-01-10",
        isActive: true,
      },
    ])
  }, [])

  const handleCreateEmployee = async (formData: FormData) => {
    setIsLoading(true)
    try {
      // Here you would call your API to create employee
      const newEmployee = {
        id: Date.now().toString(),
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as UserRole,
        createdAt: new Date().toISOString().split("T")[0],
        isActive: true,
      }

      setEmployees((prev) => [...prev, newEmployee])
      setIsCreateDialogOpen(false)
      toast.success("Zaměstnanec byl úspěšně vytvořen")
    } catch (error) {
      toast.error("Chyba při vytváření zaměstnance")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-red-100 text-red-800"
      case UserRole.MANAGER:
        return "bg-purple-100 text-purple-800"
      case UserRole.TERAPEUT:
        return "bg-blue-100 text-blue-800"
      case UserRole.MASER:
        return "bg-green-100 text-green-800"
      case UserRole.RECEPCNI:
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Administrátor"
      case UserRole.MANAGER:
        return "Manažer"
      case UserRole.TERAPEUT:
        return "Terapeut"
      case UserRole.MASER:
        return "Masér"
      case UserRole.RECEPCNI:
        return "Recepční"
      case UserRole.KOORDINATOR:
        return "Koordinátor"
      case UserRole.ASISTENT:
        return "Asistent"
      case UserRole.ESHOP_SPRAVCE:
        return "E-shop správce"
      default:
        return role
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#3C3633]">Správa zaměstnanců</h1>
          <p className="text-[#6A5F5A] mt-2">Vytvářejte, upravujte a spravujte zaměstnance salonu</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6A5F5A] hover:bg-[#3C3633] text-[#E1D7C6]">
              <UserPlus className="h-4 w-4 mr-2" />
              Přidat zaměstnance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Vytvořit nového zaměstnance</DialogTitle>
              <DialogDescription>
                Vyplňte údaje pro vytvoření nového zaměstnance. Zaměstnanec obdrží přihlašovací údaje emailem.
              </DialogDescription>
            </DialogHeader>
            <form action={handleCreateEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Jméno</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Příjmení</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte roli" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Administrátor</SelectItem>
                    <SelectItem value={UserRole.MANAGER}>Manažer</SelectItem>
                    <SelectItem value={UserRole.TERAPEUT}>Terapeut</SelectItem>
                    <SelectItem value={UserRole.MASER}>Masér</SelectItem>
                    <SelectItem value={UserRole.RECEPCNI}>Recepční</SelectItem>
                    <SelectItem value={UserRole.KOORDINATOR}>Koordinátor</SelectItem>
                    <SelectItem value={UserRole.ASISTENT}>Asistent</SelectItem>
                    <SelectItem value={UserRole.ESHOP_SPRAVCE}>E-shop správce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Zrušit
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Vytváří se..." : "Vytvořit"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seznam zaměstnanců</CardTitle>
          <CardDescription>Přehled všech zaměstnanců salonu s možností úprav a správy</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-[#6A5F5A]" />
            <Input
              placeholder="Hledat zaměstnance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jméno</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Vytvořeno</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(employee.role)}>{getRoleLabel(employee.role)}</Badge>
                  </TableCell>
                  <TableCell>{employee.createdAt}</TableCell>
                  <TableCell>
                    <Badge variant={employee.isActive ? "default" : "secondary"}>
                      {employee.isActive ? "Aktivní" : "Neaktivní"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Eye,
  Smartphone,
  HelpCircle,
  LogOut,
  Edit,
  Trash2,
  Download,
  Upload,
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    games: true,
    tasks: true,
    rewards: false,
    social: true,
    marketing: false,
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showActivity: true,
    showRanking: true,
    allowMessages: false,
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Configurações</h1>
          <div></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-[#28CA00]" />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback className="bg-[#28CA00] text-black text-xl">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-white">João da Silva</h3>
                <p className="text-sm text-gray-400">joao.silva@email.com</p>
                <p className="text-sm text-gray-400">Flamengo • Torcida Jovem</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-700 text-gray-400 hover:text-white bg-transparent"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>

            <Separator className="bg-gray-700" />

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nome Completo
                </Label>
                <Input id="name" defaultValue="João da Silva" className="bg-gray-800 border-gray-700 text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="joao.silva@email.com"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Telefone
                </Label>
                <Input id="phone" placeholder="(11) 99999-9999" className="bg-gray-800 border-gray-700 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#28CA00]" />
              Notificações
            </CardTitle>
            <CardDescription className="text-gray-400">Gerencie como você recebe notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Jogos e Eventos</Label>
                <p className="text-sm text-gray-400">Notificações sobre jogos do seu clube</p>
              </div>
              <Switch
                checked={notifications.games}
                onCheckedChange={(checked) => setNotifications({ ...notifications, games: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Tarefas e Desafios</Label>
                <p className="text-sm text-gray-400">Novas tarefas e desafios disponíveis</p>
              </div>
              <Switch
                checked={notifications.tasks}
                onCheckedChange={(checked) => setNotifications({ ...notifications, tasks: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Recompensas</Label>
                <p className="text-sm text-gray-400">Tokens ganhos e recompensas disponíveis</p>
              </div>
              <Switch
                checked={notifications.rewards}
                onCheckedChange={(checked) => setNotifications({ ...notifications, rewards: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Atividade Social</Label>
                <p className="text-sm text-gray-400">Interações e menções</p>
              </div>
              <Switch
                checked={notifications.social}
                onCheckedChange={(checked) => setNotifications({ ...notifications, social: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Marketing</Label>
                <p className="text-sm text-gray-400">Ofertas e promoções especiais</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#28CA00]" />
              Privacidade
            </CardTitle>
            <CardDescription className="text-gray-400">Controle quem pode ver suas informações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Perfil Público</Label>
                <p className="text-sm text-gray-400">Outros usuários podem ver seu perfil</p>
              </div>
              <Switch
                checked={privacy.profilePublic}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, profilePublic: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Mostrar Atividades</Label>
                <p className="text-sm text-gray-400">Exibir histórico de atividades</p>
              </div>
              <Switch
                checked={privacy.showActivity}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, showActivity: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Aparecer no Ranking</Label>
                <p className="text-sm text-gray-400">Ser listado nos rankings públicos</p>
              </div>
              <Switch
                checked={privacy.showRanking}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, showRanking: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Permitir Mensagens</Label>
                <p className="text-sm text-gray-400">Outros usuários podem te enviar mensagens</p>
              </div>
              <Switch
                checked={privacy.allowMessages}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, allowMessages: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#28CA00]" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Autenticação de Dois Fatores</Label>
                <p className="text-sm text-gray-400">Adicione uma camada extra de segurança</p>
              </div>
              <Switch
                checked={security.twoFactor}
                onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Alertas de Login</Label>
                <p className="text-sm text-gray-400">Notificar sobre novos logins</p>
              </div>
              <Switch
                checked={security.loginAlerts}
                onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
              />
            </div>

            <Separator className="bg-gray-700" />

            <Button variant="outline" className="w-full border-gray-700 text-gray-400 hover:text-white bg-transparent">
              Alterar Senha
            </Button>

            <Button variant="outline" className="w-full border-gray-700 text-gray-400 hover:text-white bg-transparent">
              Gerenciar Dispositivos Conectados
            </Button>
          </CardContent>
        </Card>

        {/* Data & Storage */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-[#28CA00]" />
              Dados e Armazenamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-400 hover:text-white justify-start bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar Meus Dados
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-400 hover:text-white justify-start bg-transparent"
            >
              <Upload className="h-4 w-4 mr-2" />
              Backup da Carteira
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-400 hover:text-white justify-start bg-transparent"
            >
              Limpar Cache do App
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#28CA00]" />
              Suporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-400 hover:text-white justify-start bg-transparent"
            >
              Central de Ajuda
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-400 hover:text-white justify-start bg-transparent"
            >
              Reportar Problema
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-400 hover:text-white justify-start bg-transparent"
            >
              Contatar Suporte
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-400 hover:text-white justify-start bg-transparent"
            >
              Termos de Uso
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-400 hover:text-white justify-start bg-transparent"
            >
              Política de Privacidade
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-900/20 border-red-700">
          <CardHeader>
            <CardTitle className="text-red-400">Zona de Perigo</CardTitle>
            <CardDescription className="text-gray-400">Ações irreversíveis - proceda com cuidado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-red-700 text-red-400 hover:bg-red-900/30 justify-start bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Conta
            </Button>

            <Button
              variant="outline"
              className="w-full border-red-700 text-red-400 hover:bg-red-900/30 justify-start bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair de Todos os Dispositivos
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center text-sm text-gray-400">
            <p>TRBE v1.0.0</p>
            <p>© 2024 TRBE. Todos os direitos reservados.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

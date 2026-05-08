"use client";

import React, { useState } from "react";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Cpu, 
  Save,
  Database,
  CheckCircle2,
  Loader2,
  UserPlus,
  Trash2,
  Edit
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    role: ""
  });

  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "RESIDENT"
  });

  const [systemData, setSystemData] = useState({
    mqttHost: "broker.emqx.io",
    mqttPort: "1883",
    mqttProtocol: "TCP",
    debugMode: false,
    autoClean: true
  });

  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    whatsapp: false,
    telegram: false
  });

  // Fetch initial profile
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/core/users/me/');
        setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch users when on users tab
  React.useEffect(() => {
    if (activeTab === "users") {
      const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
          const { data } = await api.get('/core/users/');
          setUsers(data);
        } catch (err) {
          console.error("Error fetching users", err);
        } finally {
          setIsLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await api.patch('/core/users/me/', profileData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (activeTab === "profile") {
      await handleSaveProfile();
    } else {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }, 1000);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post('/core/users/', newUserData);
      const { data } = await api.get('/core/users/');
      setUsers(data);
      setIsNewUserOpen(false);
      setNewUserData({ username: "", email: "", password: "", first_name: "", last_name: "", role: "RESIDENT" });
    } catch (err) {
      console.error("Error creating user", err);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "users", label: "Usuarios", icon: UserPlus },
    { id: "system", label: "Sistema", icon: Cpu },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "security", label: "Seguridad", icon: Shield },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
            <h1 className="text-4xl font-black tracking-tight text-white">Configuración</h1>
          </div>
          <p className="text-white/35 ml-5 font-medium">Personaliza las preferencias de tu cuenta y del sistema IoT.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {saveSuccess && (
            <div className="flex items-center gap-2 text-emerald-400 animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Cambios guardados</span>
            </div>
          )}
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white gap-2 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        <Card className="w-full lg:w-64 shrink-0 glass border-none p-2 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </Card>

        {/* Content Area */}
        <div className="flex-1 w-full space-y-6">
          {activeTab === "profile" && (
            <Card className="glass border-none overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Información del Perfil</CardTitle>
                  <CardDescription>Actualiza tu información personal y cómo te ven los demás.</CardDescription>
                </div>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar Perfil
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-primary/20 relative group overflow-hidden">
                    <span>{profileData.first_name ? profileData.first_name.charAt(0) : profileData.username.charAt(0)}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold">@{profileData.username}</p>
                    <p className="text-sm text-muted-foreground">{profileData.role === 'ADMIN' ? 'Administrador del Sistema' : 'Usuario del Sistema'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="first_name">Nombre</Label>
                    <Input 
                      id="first_name" 
                      value={profileData.first_name} 
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                      className="bg-black/20 border-white/10 h-12" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="last_name">Apellido</Label>
                    <Input 
                      id="last_name" 
                      value={profileData.last_name} 
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                      className="bg-black/20 border-white/10 h-12" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input 
                      id="email" 
                      value={profileData.email} 
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="bg-black/20 border-white/10 h-12" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input 
                      id="phone" 
                      value={profileData.phone} 
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="bg-black/20 border-white/10 h-12" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "users" && (
            <Card className="glass border-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>Crea y administra los accesos de administradores y residentes.</CardDescription>
                </div>
                <Button 
                  onClick={() => setIsNewUserOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Nuevo Usuario
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-muted-foreground font-bold">
                        <th className="px-6 py-4">Usuario</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {isLoadingUsers ? (
                        <tr><td colSpan={4} className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
                      ) : users.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                {u.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-white/90">@{u.username}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                              u.role === 'ADMIN' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            )}>
                              {u.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                             <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10"><Edit className="w-4 h-4" /></Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/20 text-red-400"><Trash2 className="w-4 h-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>

              {/* New User Dialog */}
              <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
                <DialogContent className="glass border-white/10 sm:max-w-[425px]">
                  <form onSubmit={handleCreateUser}>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                      <DialogDescription>
                        Asigna credenciales y un rol en el sistema.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Usuario</Label>
                          <Input 
                            value={newUserData.username} 
                            onChange={e => setNewUserData({...newUserData, username: e.target.value})}
                            className="bg-black/20 border-white/10" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rol</Label>
                          <Select value={newUserData.role} onValueChange={v => setNewUserData({...newUserData, role: v})}>
                            <SelectTrigger className="bg-black/20 border-white/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-white/10">
                              <SelectItem value="ADMIN">Administrador</SelectItem>
                              <SelectItem value="RESIDENT">Usuario / Residente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input 
                          type="email"
                          value={newUserData.email} 
                          onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                          className="bg-black/20 border-white/10" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contraseña</Label>
                        <Input 
                          type="password"
                          value={newUserData.password} 
                          onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                          className="bg-black/20 border-white/10" 
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex gap-3">
                      <Button type="button" variant="ghost" className="flex-1 border-white/10" onClick={() => setIsNewUserOpen(false)}>Cancelar</Button>
                      <Button type="submit" className="flex-1 bg-primary text-white" disabled={isSaving}>
                         {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                         Crear Usuario
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          )}

          {activeTab === "system" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="glass border-none">
                <CardHeader className="bg-white/5 border-b border-white/5">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Servidor MQTT (EMQX)
                  </CardTitle>
                  <CardDescription>Configuración del broker para comunicación IoT.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-white/80">Host del Broker</Label>
                    <Input 
                      value={systemData.mqttHost} 
                      onChange={(e) => setSystemData({...systemData, mqttHost: e.target.value})}
                      className="bg-black/20 border-white/10 focus-visible:ring-primary h-11" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-white/80">Puerto</Label>
                      <Input 
                        value={systemData.mqttPort} 
                        onChange={(e) => setSystemData({...systemData, mqttPort: e.target.value})}
                        className="bg-black/20 border-white/10 focus-visible:ring-primary h-11" 
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white/80">Protocolo</Label>
                      <Input 
                        value={systemData.mqttProtocol} 
                        onChange={(e) => setSystemData({...systemData, mqttProtocol: e.target.value})}
                        className="bg-black/20 border-white/10 focus-visible:ring-primary h-11" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mt-6">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                      Estado: Conectado
                    </div>
                    <Button variant="ghost" size="sm" className="text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300">Test de Conexión</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-none">
                <CardHeader className="bg-white/5 border-b border-white/5">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Base de Datos
                  </CardTitle>
                  <CardDescription>Almacenamiento de telemetría y configuración del sistema.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Modo de Depuración</Label>
                      <p className="text-sm text-muted-foreground">Registra todos los payloads MQTT recibidos.</p>
                    </div>
                    <Switch 
                      checked={systemData.debugMode} 
                      onCheckedChange={(c) => setSystemData({...systemData, debugMode: c})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Auto-limpieza de Datos</Label>
                      <p className="text-sm text-muted-foreground">Elimina lecturas con más de 90 días.</p>
                    </div>
                    <Switch 
                      checked={systemData.autoClean} 
                      onCheckedChange={(c) => setSystemData({...systemData, autoClean: c})}
                    />
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 bg-black/20 h-11">
                      Generar Backup SQL (.dump)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <Card className="glass border-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle>Canales de Alerta</CardTitle>
                <CardDescription>Configura cómo y dónde recibes notificaciones críticas del sistema.</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6 space-y-2">
                {[
                  { id: 'push', title: 'Notificaciones Push (Navegador)', desc: 'Recibe alertas instantáneas mientras usas el panel.', active: notifications.push },
                  { id: 'email', title: 'Resumen por Correo Electrónico', desc: 'Reportes diarios y alertas de mantenimiento.', active: notifications.email },
                  { id: 'whatsapp', title: 'Alertas por WhatsApp Business', desc: 'Notificaciones críticas directamente a tu móvil.', active: notifications.whatsapp },
                  { id: 'telegram', title: 'Bot de Telegram', desc: 'Integración con grupos operativos de mantenimiento.', active: notifications.telegram },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 sm:p-6 bg-black/10 rounded-xl border border-transparent hover:border-white/5 hover:bg-black/20 transition-all">
                    <div className="space-y-1 pr-4">
                      <Label className="text-base font-medium text-white/90">{item.title}</Label>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch 
                      checked={item.active} 
                      onCheckedChange={(checked) => setNotifications({...notifications, [item.id]: checked})}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="glass border-none animate-in fade-in slide-in-from-bottom-4 duration-500 flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4 max-w-md mx-auto p-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Seguridad y Acceso</h3>
                <p className="text-muted-foreground">
                  El módulo de seguridad avanzada, auditoría de logs y gestión de tokens API estará disponible en la próxima actualización.
                </p>
                <Button variant="outline" className="mt-4 border-white/10">Ver Roadmap de Seguridad</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

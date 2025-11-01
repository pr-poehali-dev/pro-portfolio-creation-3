import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface User {
  username: string;
  password: string;
  avatar: string;
  nickname: string;
}

interface Work {
  id: string;
  image: string;
  title: string;
  description: string;
  isFavorite: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<'gallery' | 'favorites' | 'settings'>('gallery');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showWorkDialog, setShowWorkDialog] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [newNickname, setNewNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  
  const [works, setWorks] = useState<Work[]>([
    {
      id: '1',
      image: '/placeholder.svg',
      title: 'Проект 1',
      description: 'Описание проекта 1',
      isFavorite: false
    },
    {
      id: '2',
      image: '/placeholder.svg',
      title: 'Проект 2',
      description: 'Описание проекта 2',
      isFavorite: false
    }
  ]);

  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [newWorkDescription, setNewWorkDescription] = useState('');
  const [newWorkImage, setNewWorkImage] = useState<File | null>(null);

  const handleRegister = () => {
    if (!regUsername || !regPassword) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }
    if (users.find(u => u.username === regUsername)) {
      toast({ title: 'Ошибка', description: 'Пользователь уже существует', variant: 'destructive' });
      return;
    }
    const newUser: User = {
      username: regUsername,
      password: regPassword,
      avatar: '/placeholder.svg',
      nickname: regUsername
    };
    setUsers([...users, newUser]);
    toast({ title: 'Успешно', description: 'Регистрация завершена' });
    setAuthMode('login');
    setRegUsername('');
    setRegPassword('');
  };

  const handleLogin = () => {
    const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setShowAuth(false);
      toast({ title: 'Добро пожаловать!', description: `Привет, ${user.nickname}` });
    } else {
      toast({ title: 'Ошибка', description: 'Неверный логин или пароль', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsAdminMode(false);
    setCurrentView('gallery');
    toast({ title: 'До встречи!', description: 'Вы вышли из системы' });
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'Nast8292jw') {
      setIsAdminMode(true);
      setShowAdminDialog(false);
      setAdminPassword('');
      toast({ title: 'Админ-режим', description: 'Вы вошли в админ-панель' });
    } else {
      toast({ title: 'Ошибка', description: 'Неверный пароль', variant: 'destructive' });
    }
  };

  const toggleFavorite = (id: string) => {
    setWorks(works.map(w => w.id === id ? { ...w, isFavorite: !w.isFavorite } : w));
  };

  const handleUpdateProfile = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        nickname: newNickname || currentUser.nickname,
        password: newPassword || currentUser.password,
        avatar: newAvatar || currentUser.avatar
      };
      setUsers(users.map(u => u.username === currentUser.username ? updatedUser : u));
      setCurrentUser(updatedUser);
      toast({ title: 'Сохранено', description: 'Профиль обновлен' });
      setNewNickname('');
      setNewPassword('');
      setNewAvatar('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewWorkImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWorkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewWorkImage(file);
    }
  };

  const handleAddWork = () => {
    if (!newWorkTitle || !newWorkImage) {
      toast({ title: 'Ошибка', description: 'Заполните название и выберите изображение', variant: 'destructive' });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const newWork: Work = {
        id: Date.now().toString(),
        image: reader.result as string,
        title: newWorkTitle,
        description: newWorkDescription,
        isFavorite: false
      };
      setWorks([...works, newWork]);
      toast({ title: 'Готово', description: 'Работа добавлена' });
      setNewWorkTitle('');
      setNewWorkDescription('');
      setNewWorkImage(null);
    };
    reader.readAsDataURL(newWorkImage);
  };

  const handleDeleteWork = (id: string) => {
    setWorks(works.filter(w => w.id !== id));
    toast({ title: 'Удалено', description: 'Работа удалена из портфолио' });
  };

  const favoriteWorks = works.filter(w => w.isFavorite);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/10">
        <Card className="w-full max-w-md p-8 space-y-6 backdrop-blur-sm bg-card/80 border-primary/20">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-primary">Pro Portfolio</h1>
            <p className="text-muted-foreground">Профессиональное портфолио</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={authMode === 'login' ? 'default' : 'outline'}
                onClick={() => setAuthMode('login')}
                className="w-full"
              >
                Вход
              </Button>
              <Button 
                variant={authMode === 'register' ? 'default' : 'outline'}
                onClick={() => setAuthMode('register')}
                className="w-full"
              >
                Регистрация
              </Button>
            </div>

            {authMode === 'login' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Логин</Label>
                  <Input 
                    id="login-username"
                    placeholder="Введите логин"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Пароль</Label>
                  <Input 
                    id="login-password"
                    type="password"
                    placeholder="Введите пароль"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleLogin} className="w-full">
                  Войти
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Логин</Label>
                  <Input 
                    id="reg-username"
                    placeholder="Придумайте логин"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Пароль</Label>
                  <Input 
                    id="reg-password"
                    type="password"
                    placeholder="Придумайте пароль"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleRegister} className="w-full">
                  Зарегистрироваться
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="border-2 border-primary">
                <AvatarImage src={currentUser?.avatar} />
                <AvatarFallback>{currentUser?.nickname[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-lg">{currentUser?.nickname}</h2>
                {isAdminMode && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <Icon name="Shield" size={12} />
                    Админ-режим
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 justify-center">
              <Button
                variant={currentView === 'gallery' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('gallery')}
                className="gap-2"
              >
                <Icon name="LayoutGrid" size={16} />
                Галерея
              </Button>
              <Button
                variant={currentView === 'favorites' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('favorites')}
                className="gap-2"
              >
                <Icon name="Heart" size={16} />
                Избранное
              </Button>
              <Button
                variant={currentView === 'settings' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('settings')}
                className="gap-2"
              >
                <Icon name="Settings" size={16} />
                Настройки
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Icon name="LogOut" size={16} />
                Выход
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-3xl font-bold">Галерея работ</h1>
              {isAdminMode && (
                <div className="w-full sm:w-auto space-y-2">
                  <Card className="p-4 space-y-3 bg-card/50">
                    <h3 className="font-semibold text-sm">Добавить работу</h3>
                    <Input 
                      placeholder="Название" 
                      value={newWorkTitle}
                      onChange={(e) => setNewWorkTitle(e.target.value)}
                      className="text-sm"
                    />
                    <Input 
                      placeholder="Описание" 
                      value={newWorkDescription}
                      onChange={(e) => setNewWorkDescription(e.target.value)}
                      className="text-sm"
                    />
                    <div>
                      <Label htmlFor="work-image" className="cursor-pointer">
                        <div className="flex items-center gap-2 p-2 border border-dashed border-primary/50 rounded-md hover:bg-primary/5 transition-colors">
                          <Icon name="Upload" size={16} />
                          <span className="text-sm">
                            {newWorkImage ? newWorkImage.name : 'Загрузить изображение'}
                          </span>
                        </div>
                      </Label>
                      <Input 
                        id="work-image"
                        type="file" 
                        accept="image/*"
                        onChange={handleWorkImageUpload}
                        className="hidden"
                      />
                    </div>
                    <Button onClick={handleAddWork} size="sm" className="w-full">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить
                    </Button>
                  </Card>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {works.map(work => (
                <Card 
                  key={work.id} 
                  className="group overflow-hidden hover-scale cursor-pointer bg-card/50 backdrop-blur-sm border-primary/20"
                >
                  <div 
                    className="relative aspect-square overflow-hidden"
                    onClick={() => {
                      setSelectedWork(work);
                      setShowWorkDialog(true);
                    }}
                  >
                    <img 
                      src={work.image} 
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-lg">{work.title}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(work.id);
                        }}
                        className="shrink-0 hover-scale"
                      >
                        <Icon 
                          name="Heart" 
                          size={20}
                          className={work.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}
                        />
                      </button>
                    </div>
                    {isAdminMode && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWork(work.id);
                        }}
                        className="w-full"
                      >
                        <Icon name="Trash2" size={14} className="mr-2" />
                        Удалить
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentView === 'favorites' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Избранное</h1>
            {favoriteWorks.length === 0 ? (
              <Card className="p-12 text-center bg-card/50">
                <Icon name="Heart" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Вы еще не добавили работы в избранное</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {favoriteWorks.map(work => (
                  <Card 
                    key={work.id} 
                    className="group overflow-hidden hover-scale cursor-pointer bg-card/50 backdrop-blur-sm border-primary/20"
                    onClick={() => {
                      setSelectedWork(work);
                      setShowWorkDialog(true);
                    }}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={work.image} 
                        alt={work.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{work.title}</h3>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Настройки</h1>
            
            <Card className="p-6 space-y-6 bg-card/50">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Профиль</h3>
                
                <div className="space-y-2">
                  <Label>Аватар</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 border-2 border-primary">
                      <AvatarImage src={newAvatar || currentUser?.avatar} />
                      <AvatarFallback>{currentUser?.nickname[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Icon name="Upload" size={16} className="mr-2" />
                            Загрузить
                          </span>
                        </Button>
                      </Label>
                      <Input 
                        id="avatar-upload"
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">Никнейм</Label>
                  <Input 
                    id="nickname"
                    placeholder={currentUser?.nickname}
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Новый пароль</Label>
                  <Input 
                    id="new-password"
                    type="password"
                    placeholder="Оставьте пустым, чтобы не менять"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <Button onClick={handleUpdateProfile} className="w-full">
                  Сохранить изменения
                </Button>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Админ-панель</h3>
                <Button
                  variant={isAdminMode ? 'default' : 'outline'}
                  onClick={() => {
                    if (isAdminMode) {
                      setIsAdminMode(false);
                      toast({ title: 'Выход', description: 'Вы вышли из админ-режима' });
                    } else {
                      setShowAdminDialog(true);
                    }
                  }}
                  className={`w-full ${isAdminMode ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  <Icon name="Shield" size={16} className="mr-2" />
                  {isAdminMode ? 'Выйти из админ-панели' : 'Войти в админ-панель'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Вход в админ-панель</DialogTitle>
            <DialogDescription>
              Введите пароль администратора для доступа к расширенным функциям
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Пароль администратора</Label>
              <Input 
                id="admin-password"
                type="password"
                placeholder="Введите пароль"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            <Button onClick={handleAdminLogin} className="w-full">
              Войти
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showWorkDialog} onOpenChange={setShowWorkDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedWork?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img 
              src={selectedWork?.image} 
              alt={selectedWork?.title}
              className="w-full rounded-lg"
            />
            <p className="text-muted-foreground">{selectedWork?.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardNav } from "@/components/dashboard-nav"
import { Separator } from "@/components/ui/separator"
import { useUser, useAuth, initiateAnonymousSignIn } from "@/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Scissors } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isUserLoading, userError } = useUser()
  const auth = useAuth()
  const [loginError, setLoginError] = React.useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = React.useState(false)

  const handleSignIn = async () => {
    if (!auth) return
    setIsLoggingIn(true)
    setLoginError(null)
    try {
      await initiateAnonymousSignIn(auth)
    } catch (e: any) {
      setLoginError(e.message || "Failed to sign in. Please check your Firebase settings.")
      setIsLoggingIn(false)
    }
  }

  if (userError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-destructive/50 bg-destructive/10">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">Session Error</CardTitle>
            <CardDescription>{userError.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Reload Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [showLongLoading, setShowLongLoading] = React.useState(false)

  React.useEffect(() => {
    if (isUserLoading) {
      const timer = setTimeout(() => setShowLongLoading(true), 5000)
      return () => clearTimeout(timer)
    }
    setShowLongLoading(false)
  }, [isUserLoading])

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Initializing secure session...</p>
            {showLongLoading && (
              <p className="text-xs text-muted-foreground/60 animate-in fade-in slide-in-from-top-1 duration-1000">
                This is taking longer than expected. <br />
                Please check your internet connection or <button onClick={() => window.location.reload()} className="underline hover:text-primary">reload the page</button>.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold font-headline">Admin Access</CardTitle>
            <CardDescription>
              Please sign in to access the StudioSuite management dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90"
            >
              {isLoggingIn ? "Signing In..." : "Sign In to Management"}
            </Button>

            {loginError && (
              <p className="text-xs text-destructive text-center font-medium animate-in fade-in zoom-in-95">
                {loginError}
              </p>
            )}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Scissors className="h-3 w-3" />
              <span>StudioSuite Luxury Management Platform</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <DashboardNav />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
             <h1 className="text-sm font-medium text-muted-foreground">Studio Administration</h1>
          </div>
          <div className="flex items-center gap-4 pr-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Admin: {user.uid.substring(0, 8)}
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
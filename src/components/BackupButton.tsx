import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const BackupButton = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);

  // Backup automático cada 60 segundos
  useEffect(() => {
    const autoBackup = async () => {
      if (isBackingUp) return;
      
      try {
        const response = await fetch('/api/backup', { method: 'POST' });
        const result = await response.json();
        
        if (result.success) {
          console.log('✅ Auto-backup exitoso:', result.commit);
          setLastBackupTime(new Date().toLocaleTimeString('es-ES'));
        }
      } catch (error) {
        console.error('Auto-backup error:', error);
      }
    };

    const interval = setInterval(autoBackup, 60000); // Cada 60 segundos
    return () => clearInterval(interval);
  }, [isBackingUp]);

  const handleManualBackup = async () => {
    setIsBackingUp(true);
    
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Error al respaldar');
      }
      
      if (result.success) {
        toast.success("✅ Respaldo completado", {
          description: `${result.filesUpdated} archivos actualizados\n${result.commit}`
        });
        setLastBackupTime(new Date().toLocaleTimeString('es-ES'));
      } else {
        toast.info("ℹ️ Sin cambios", {
          description: result.message || "No hay cambios nuevos para respaldar"
        });
      }
    } catch (error) {
      console.error('Error en backup:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      toast.error("❌ Error al respaldar", {
        description: errorMsg
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleManualBackup}
        disabled={isBackingUp}
        className="w-full"
        variant="default"
      >
        {isBackingUp ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Respaldando...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Respaldar Ahora
          </>
        )}
      </Button>
      
      {lastBackupTime && (
        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
          <CheckCircle2 className="h-4 w-4" />
          <span>Último respaldo: {lastBackupTime}</span>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground text-center">
        🤖 Los respaldos se ejecutan automáticamente cada minuto
      </p>
    </div>
  );
};

export type EstadoSocio = "activo" | "inactivo" | "suspendido";
export type EstadoCuota = "pendiente" | "pagada" | "vencida" | "anulada";
export type MetodoPago = "efectivo" | "transferencia" | "otro";

export type Categoria = {
  id: string;
  nombre: string;
  monto_cuota: number;
  activa: boolean;
  created_at: string;
};

export type Socio = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string | null;
  email: string | null;
  telefono: string | null;
  categoria_id: string;
  fecha_ingreso: string;
  estado: EstadoSocio;
  notas: string | null;
  created_at: string;
  updated_at: string;
};

export type Cuota = {
  id: string;
  socio_id: string;
  periodo: string;
  monto: number;
  estado: EstadoCuota;
  fecha_vencimiento: string;
  created_at: string;
};

export type Pago = {
  id: string;
  cuota_id: string | null;
  socio_id: string;
  monto: number;
  metodo: MetodoPago;
  fecha_pago: string;
  observaciones: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: Categoria;
        Insert: Omit<Categoria, "id" | "created_at">;
        Update: Partial<Omit<Categoria, "id" | "created_at">>;
        Relationships: [];
      };
      socios: {
        Row: Socio;
        Insert: Omit<Socio, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Socio, "id" | "created_at" | "updated_at">>;
        Relationships: [
          {
            foreignKeyName: "socios_categoria_id_fkey";
            columns: ["categoria_id"];
            isOneToOne: false;
            referencedRelation: "categorias";
            referencedColumns: ["id"];
          },
        ];
      };
      cuotas: {
        Row: Cuota;
        Insert: Omit<Cuota, "id" | "created_at">;
        Update: Partial<Omit<Cuota, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "cuotas_socio_id_fkey";
            columns: ["socio_id"];
            isOneToOne: false;
            referencedRelation: "socios";
            referencedColumns: ["id"];
          },
        ];
      };
      pagos: {
        Row: Pago;
        Insert: Omit<Pago, "id" | "created_at">;
        Update: Partial<Omit<Pago, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "pagos_cuota_id_fkey";
            columns: ["cuota_id"];
            isOneToOne: false;
            referencedRelation: "cuotas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pagos_socio_id_fkey";
            columns: ["socio_id"];
            isOneToOne: false;
            referencedRelation: "socios";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

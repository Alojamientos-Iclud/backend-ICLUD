-- CreateTable
CREATE TABLE "OfertaPendiente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "localizacion" TEXT NOT NULL,
    "cantidad_habitaciones" INTEGER NOT NULL DEFAULT 0,
    "imagen_h" TEXT,
    "descripcion" TEXT NOT NULL DEFAULT '',
    "precio" INTEGER NOT NULL DEFAULT 0,
    "fecha_subido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfertaPendiente_pkey" PRIMARY KEY ("id")
);

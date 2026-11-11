-- CreateTable
CREATE TABLE "Formulario" (
    "id" SERIAL NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "gmail" TEXT NOT NULL,
    "cantidad_huespedes" INTEGER NOT NULL,
    "llegada" DATE NOT NULL,
    "salida" DATE NOT NULL,
    "fecha_subido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Formulario_pkey" PRIMARY KEY ("id")
);

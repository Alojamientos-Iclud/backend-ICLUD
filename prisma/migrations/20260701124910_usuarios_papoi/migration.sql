-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "gmail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "estatus" TEXT NOT NULL,
    "fecha_subido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

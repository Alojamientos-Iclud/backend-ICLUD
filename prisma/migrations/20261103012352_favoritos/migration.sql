-- CreateTable
CREATE TABLE "Favorito" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "nombreAlojamiento" TEXT NOT NULL,
    "precio" DOUBLE PRECISION,
    "urlOrigen" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "fechaGuardado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorito_idUsuario_urlOrigen_key" ON "Favorito"("idUsuario", "urlOrigen");

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

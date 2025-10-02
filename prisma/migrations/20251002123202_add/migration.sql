-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "public"."RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "public"."RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "RefreshToken_revoked_expiresAt_idx" ON "public"."RefreshToken"("revoked", "expiresAt");

-- CreateIndex
CREATE INDEX "Student_createdAt_idx" ON "public"."Student"("createdAt");

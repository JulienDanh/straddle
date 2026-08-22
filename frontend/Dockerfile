FROM node:22-bookworm-slim

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files first for layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and config files
COPY src/ src/
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY .oxlintrc.json ./

EXPOSE 5173

CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Solver API image. Build from the repo root:
#   docker build -f packages/gto/Dockerfile -t gto-server .
#   docker run -p 8080:8080 gto-server
# The range store is baked in (s1-cbet's include_str! needs it at compile
# time); the API itself takes ranges per request.

FROM rust:1-slim AS build
RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /repo

# Dependency layer: manifests + stub sources, so the postflop-solver git
# dependency compiles once and is cached across source edits.
COPY packages/gto/Cargo.toml packages/gto/Cargo.lock packages/gto/
RUN mkdir -p packages/gto/src/bin \
    && echo 'pub fn stub() {}' > packages/gto/src/lib.rs \
    && for b in solve s1-cbet server; do echo 'fn main() {}' > packages/gto/src/bin/$b.rs; done \
    && cargo build --release --manifest-path packages/gto/Cargo.toml \
    && rm -rf packages/gto/src

# Real sources + the range store (include_str! paths resolve relative to
# src/bin, so the tree must mirror the repo layout).
COPY packages/gto/src packages/gto/src
COPY packages/ranges/data packages/ranges/data
RUN touch packages/gto/src/lib.rs packages/gto/src/bin/*.rs \
    && cargo build --release --manifest-path packages/gto/Cargo.toml

FROM debian:bookworm-slim
COPY --from=build /repo/packages/gto/target/release/server /usr/local/bin/gto-server
EXPOSE 8080
ENV GTO_ADDR=0.0.0.0:8080
ENTRYPOINT ["gto-server"]

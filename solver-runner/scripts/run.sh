#!/usr/bin/env bash
# Wrapper for cargo that supplies the local toolchain: rustup's cargo plus the
# conda-forge gcc from the "rust" micromamba env (the WSL distro has no system
# compiler). Usage: scripts/run.sh build --release   (or any cargo args)
set -euo pipefail

export PATH="$HOME/.cargo/bin:$HOME/micromamba/envs/rust/bin:$PATH"
export CC="$HOME/micromamba/envs/rust/bin/x86_64-conda-linux-gnu-cc"
export CARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_LINKER="$CC"

exec cargo "$@"

#!/usr/bin/env bash
set -euo pipefail

# SDC RADIUS base installer for Ubuntu 24.04.
# Run as root. This installs packages only; production secrets and NAS details
# must be configured manually before enabling service access.

if [[ $EUID -ne 0 ]]; then
  echo "Run as root: sudo bash radius/install.sh"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y freeradius freeradius-mysql mariadb-server mariadb-client

systemctl enable --now mariadb
systemctl enable --now freeradius

cat <<'EOF'

SDC RADIUS base installation completed.
Next steps:
1. Create the FreeRADIUS SQL database and user.
2. Import the FreeRADIUS schema.
3. Enable the SQL module.
4. Add the MikroTik NAS IP and a strong shared secret.
5. Add PPPoE users/packages to radcheck/radreply or groups.
6. Test with: radtest USER PASSWORD 127.0.0.1 0 SECRET
7. Run: freeradius -X for troubleshooting.

Do not put real passwords or shared secrets into Git.
EOF

#!/usr/bin/env bash
set -euo pipefail

# SDC Ubilling + FreeRADIUS base deployment helper for Ubuntu 24.04.
# This script installs prerequisites and clones the official Ubilling source.
# Review the upstream documentation before production deployment.

if [[ $EUID -ne 0 ]]; then
  echo "Run as root: sudo bash install.sh"
  exit 1
fi

UBILLING_DIR="/var/www/ubilling"
export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y git apache2 mariadb-server mariadb-client freeradius freeradius-mysql php php-cli php-mysql php-curl php-gd php-mbstring php-xml php-zip unzip rsync

systemctl enable --now mariadb
systemctl enable --now apache2
systemctl enable --now freeradius

if [[ -d "$UBILLING_DIR/.git" ]]; then
  git -C "$UBILLING_DIR" pull --ff-only
else
  git clone https://github.com/nightflyza/Ubilling.git "$UBILLING_DIR"
fi

chown -R www-data:www-data "$UBILLING_DIR"

cat <<'EOF'

SDC Ubilling base deployment completed.

Next:
1. Configure MariaDB according to the Ubilling documentation.
2. Configure Apache/PHP for /var/www/ubilling.
3. Configure FreeRADIUS SQL and import its schema.
4. Add the MikroTik NAS IP and a strong RADIUS shared secret.
5. Configure PPPoE packages and user attributes.
6. Test FreeRADIUS with radtest and freeradius -X.

No production secrets are stored in this repository.
EOF

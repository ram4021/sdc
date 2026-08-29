# SDC MikroTik RADIUS template
# Replace placeholders locally. Do NOT commit real secrets.

/radius
add address=RADIUS_SERVER_IP secret=RADIUS_SHARED_SECRET service=ppp timeout=3s

/ppp aaa
set use-radius=yes accounting=yes interim-update=5m

# Example package attributes are returned by FreeRADIUS:
# Mikrotik-Rate-Limit = "60M/60M"
# Mikrotik-Rate-Limit = "75M/75M"
# Mikrotik-Rate-Limit = "100M/100M"

# CoA/Disconnect is normally sent from the RADIUS server to UDP 3799.
# Allow UDP 3799 only from the trusted RADIUS server in your firewall.

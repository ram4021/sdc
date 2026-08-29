# SDC MikroTik RADIUS client template
# Replace RADIUS_IP and SHARED_SECRET before importing.
# Keep the secret out of Git in production.

/radius
add address=RADIUS_IP secret=SHARED_SECRET service=ppp,login,hotspot timeout=3s

# PPPoE server example: enable use-radius on the relevant server/profile.
# /ppp aaa set use-radius=yes accounting=yes interim-update=5m

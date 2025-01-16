# Docker Security Guidelines

## Overview
This document outlines security measures implemented in our Docker configuration and provides guidelines for secure deployment and operation.

## Security Measures Implemented

### 1. Build Context Security
- Strict `.dockerignore` to prevent sensitive files from being included
- Multi-stage builds to minimize attack surface
- No secrets in image layers

### 2. Container Security
- Non-root user (nodejs:nodejs)
- Read-only filesystem where possible
- Dropped unnecessary capabilities
- No privilege escalation
- Resource limits enforced
- Health checks implemented
- Security updates in base image

### 3. Dependencies Security
- Frozen lockfile (`--frozen-lockfile`)
- Security audits during build
- Minimal production dependencies
- Regular dependency updates

## Secret Management

### Development
```bash
# DO NOT store sensitive data in:
- Dockerfile
- docker-compose files
- Git repository
- Image layers

# DO store sensitive data in:
- Local .env files (git-ignored)
- Environment variables
- Docker secrets (for swarm mode)
```

### Production
```bash
# Use secure secret management:
1. Docker secrets
2. Kubernetes secrets
3. Cloud provider secret management
   - AWS Secrets Manager
   - Azure Key Vault
   - Google Secret Manager
```

## Environment Variables

### Development
- Use `.env` files locally (never commit to git)
- Use docker-compose.dev.yml for non-sensitive configs
- Keep sensitive data in local secrets

### Production
- Use runtime environment injection
- Use orchestration platform secrets
- Never hardcode sensitive data
- Validate all environment variables at startup

## Deployment Checklist

### Pre-Deployment
- [ ] All sensitive data removed from Docker context
- [ ] Security updates applied in base image
- [ ] Dependencies audited
- [ ] Resource limits configured
- [ ] Health checks implemented
- [ ] Logging configured
- [ ] Secrets properly managed
- [ ] Network security configured

### Post-Deployment
- [ ] Health checks passing
- [ ] Resource usage within limits
- [ ] Logs properly captured
- [ ] Secrets accessible
- [ ] Network security effective
- [ ] Monitoring operational

## Monitoring Setup

### Health Monitoring
```bash
# Health check endpoints
- API: http://localhost:3000/health
- Frontend: http://localhost/health

# Check intervals
- 30 second intervals
- 5 second timeouts
- 3 retries
```

### Resource Monitoring
```yaml
# Resource limits configured
resources:
  limits:
    cpus: '1'
    memory: 1G
  reservations:
    cpus: '0.5'
    memory: 512M
```

### Logging
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## Security Best Practices

### 1. Image Security
- Use specific versions for base images
- Regular security updates
- Minimal base images
- Multi-stage builds
- Scan images for vulnerabilities

### 2. Runtime Security
- Non-root user
- Read-only filesystem
- Drop capabilities
- Resource limits
- Network isolation
- Health monitoring

### 3. Secret Management
- Use environment variables
- Implement Docker secrets
- External secret management
- Regular secret rotation
- Audit secret access

### 4. Network Security
- Internal networks for services
- Port exposure minimal
- TLS for communication
- Network segmentation
- Regular security audits

## Development Guidelines

### Local Development
```bash
# Start development environment
docker compose -f docker-compose.dev.yml up

# Build development images
docker compose -f docker-compose.dev.yml build

# View logs
docker compose -f docker-compose.dev.yml logs -f
```

### Production Deployment
```bash
# Start production environment
docker compose -f docker-compose.prod.yml up -d

# Deploy updates
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Monitor health
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

## Security Updates

### Regular Maintenance
1. Update base images monthly
2. Audit dependencies weekly
3. Rotate secrets quarterly
4. Review security configs monthly
5. Update security documentation

### Emergency Updates
1. Critical vulnerability patches
2. Security incident response
3. Immediate secret rotation
4. Configuration hardening
5. Security audit logging

## Additional Resources

- [Docker Security Documentation](https://docs.docker.com/engine/security/)
- [OWASP Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
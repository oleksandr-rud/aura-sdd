# Tesseract Deployment Guide

This guide covers deploying Spec Gen applications using Tesseract for development and production environments.

## Prerequisites

- [Tesseract CLI](https://tesseract.sh/) installed
- Access to a Tesseract-managed cluster
- Docker registry access for production deployments
- SSL certificates for production

## Quick Start

### Development Deployment

1. **Setup Environment Variables**
   ```bash
   cd tooling/tesseract/overlays/dev
   cp .env.example .env
   # Edit .env with your development values
   ```

2. **Deploy to Development Cluster**
   ```bash
   # From repository root
   tesseract stack apply --environment dev
   ```

3. **Verify Deployment**
   ```bash
   tesseract stack status --environment dev
   # Access at http://dev.spec-gen.local
   ```

### Production Deployment

1. **Setup Environment Variables**
   ```bash
   cd tooling/tesseract/overlays/prod
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Build and Push Images**
   ```bash
   # Build API image
   docker build -f apps/api/Dockerfile -t $IMAGE_REGISTRY/spec-gen/api:$VERSION .

   # Build CRM Client image
   docker build -f apps/crm-client/Dockerfile -t $IMAGE_REGISTRY/spec-gen/crm-client:$VERSION .

   # Push images
   docker push $IMAGE_REGISTRY/spec-gen/api:$VERSION
   docker push $IMAGE_REGISTRY/spec-gen/crm-client:$VERSION
   ```

3. **Deploy to Production Cluster**
   ```bash
   # From repository root
   tesseract stack apply --environment prod
   ```

4. **Verify Deployment**
   ```bash
   tesseract stack status --environment prod
   # Access at https://spec-gen.com
   ```

## Configuration Reference

### Development Environment

- **Replicas**: 1 for each service
- **Resources**: Minimal CPU/memory allocation
- **Hot Reload**: Enabled
- **Debug Mode**: Enabled
- **Health Checks**: Relaxed intervals

### Production Environment

- **Replicas**: 3 API, 2 CRM Client (with autoscaling)
- **Resources**: Higher CPU/memory limits
- **SSL/TLS**: Enabled with proper certificates
- **Monitoring**: Prometheus, Grafana, Loki enabled
- **Health Checks**: Production-grade intervals
- **Rolling Updates**: Zero-downtime deployments

## Service Endpoints

### Development
- API: `http://dev.spec-gen.local/api`
- CRM Client: `http://dev.spec-gen.local`
- Monitoring: `http://dev.spec-gen.local:3000` (Grafana)

### Production
- API: `https://spec-gen.com/api`
- CRM Client: `https://spec-gen.com`
- Monitoring: Internal access only

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   tesseract logs --service api --environment dev
   ```

2. **Health Check Failures**
   ```bash
   # Verify health endpoints
   curl http://api:4000/health
   ```

3. **Resource Constraints**
   ```bash
   # Check resource usage
   tesseract top --environment prod
   ```

### Scaling Services

```bash
# Scale API service
tesseract scale api --replicas 5 --environment prod

# Scale CRM client
tesseract scale crm-client --replicas 3 --environment prod
```

### Updating Images

```bash
# Update image version
tesseract update api --image $IMAGE_REGISTRY/spec-gen/api:v1.1.0 --environment prod
```

## Monitoring and Logs

### View Logs
```bash
# All services
tesseract logs --environment prod

# Specific service
tesseract logs --service api --environment prod --follow
```

### Health Status
```bash
# Overall stack health
tesseract health --environment prod

# Service-specific health
tesseract health --service api --environment prod
```

### Metrics
- Development: Basic health checks and resource usage
- Production: Full metrics with Prometheus, Grafana dashboards, and Loki log aggregation

## Security Notes

- All secrets should be stored in Tesseract secret stores
- Use environment-specific overlays for configuration
- Enable RBAC for production clusters
- Regular security updates for base images
- SSL/TLS enforcement for production traffic

## Backup and Recovery

### Database Backups
Production configurations should include automated database backups through your cloud provider or backup solution.

### Disaster Recovery
1. Maintain multiple environment configurations
2. Test disaster recovery procedures regularly
3. Keep infrastructure as code versioned
4. Document manual recovery steps
# Security Review Checklist

## Review Goal

Find ways the change can violate trust:

- unauthorized access
- data leakage
- secret exposure
- unsafe tool execution
- destructive side effects
- supply-chain compromise
- production impact without approval

## Severity Guide

## Critical

- auth bypass
- privilege escalation
- secret exposure
- data deletion without safeguards
- payment or production action without approval
- arbitrary code execution with broad permissions

## High

- missing resource-level authorization
- unbounded sensitive data access
- unsafe raw SQL
- broad service-role use
- untrusted tool execution
- missing validation before high-risk writes

## Medium

- weak logging or audit trail
- incomplete input validation
- missing rate limits on sensitive operations
- excessive dependency permissions
- unclear rollback path

## Low

- documentation gap
- minor hardening improvement
- unclear naming around permissions

## Baseline Questions

- What asset is protected?
- Who can trigger the action?
- What system does the action affect?
- What is the worst credible failure?
- Is the action read-only, draft-only, or action-allowed?
- Is approval required?
- Is the action observable and auditable?
- Is rollback possible?

## Required Review Areas

- authentication
- authorization
- input validation
- sensitive data handling
- secret handling
- dependency risk
- database safety
- tool permissions
- sandboxing
- observability
- human approval

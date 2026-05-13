# AGENTS.md

# E-Commerce Website Project Guidelines

## Project Overview

This project is a modern full-stack e-commerce web application built for a brand-focused online store for Katta Adventure.

Main objectives:

* scalable architecture
* clean UI/UX
* responsive design
* maintainable codebase
* secure transaction flow
* production-ready implementation

---

# Tech Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

## Backend

* Node.js
* Express.js
* Prisma ORM

## Database

* PostgreSQL

## Authentication

* JWT Authentication
* HTTP-only cookies

## Payment Gateway

* Midtrans / Xendit

## Storage

* Cloudinary

## Deployment

* Vercel
* AWS (optional)

---

# Project Structure

/apps
/frontend
/backend

/packages
/ui
/config
/types

/docs
/prisma

---

# Coding Standards

## General Rules

* Use TypeScript everywhere
* Avoid using `any`
* Write clean and readable code
* Use reusable components
* Follow modular architecture
* Use environment variables properly
* Never hardcode secrets or API keys

---

# Frontend Rules

## Components

* Keep components reusable
* Separate UI and business logic
* Use server components when possible
* Use client components only when necessary

## Styling

* Use Tailwind CSS only
* Use consistent spacing system
* Mobile-first responsive design
* Avoid inline styles

## State Management

Preferred:

* React Query / TanStack Query
* Zustand (if needed)

Avoid:

* unnecessary global state

---

# Backend Rules

## API

* Use REST API conventions
* Validate all request payloads
* Use proper HTTP status codes
* Handle errors consistently

## Database

* Use Prisma ORM
* Normalize database schema
* Add indexes when needed
* Use migrations properly

---

# Authentication Rules

* Use JWT securely
* Store tokens in HTTP-only cookies
* Protect admin routes
* Implement role-based access

Roles:

* customer
* admin

---

# Security Rules

* Sanitize user inputs
* Prevent SQL injection
* Prevent XSS
* Validate uploaded files
* Use rate limiting
* Never expose secrets

---

# Git Workflow

## Branch Naming

feature/
fix/
refactor/
hotfix/

Examples:

* feature/auth-system
* feature/payment-gateway
* fix/cart-bug

---

# Commit Convention

Use conventional commits:

feat:
fix:
refactor:
docs:
style:
chore:

Example:
feat: add checkout payment integration

---

# UI/UX Guidelines

Design principles:

* modern
* clean
* minimal
* conversion-focused
* accessible

---

# Performance Rules

* Optimize images
* Lazy load when needed
* Minimize client-side rendering
* Avoid unnecessary re-renders
* Optimize API calls

---

# Testing

Minimum testing:

* authentication
* checkout flow
* payment integration
* admin dashboard
* responsive layout

---

# AI Agent Instructions

When generating code:

* prioritize readability
* prioritize maintainability
* avoid overengineering
* generate production-ready code
* follow project structure
* avoid duplicate code

Before creating new functionality:

* check existing components first
* reuse utilities if possible
* avoid unnecessary dependencies

---

# Forbidden Practices

* No hardcoded credentials
* No inline SQL queries
* No direct database access from frontend
* No massive single components
* No unused dependencies
* No console.log in production

---

# Deployment Checklist

Before deployment:

* environment variables configured
* build passes successfully
* database migrations completed
* payment webhook configured
* responsive layout verified
* security headers enabled

---

# Future Scalability

Architecture should support:

* mobile app integration
* multi-vendor support
* analytics
* AI recommendation system
* real-time notifications

---

# Documentation

Every major module should include:

* purpose
* usage
* API structure
* environment variables
* setup instructions

---

# Final Goal

Build a scalable, maintainable, secure, and production-ready e-commerce platform with modern development standards.

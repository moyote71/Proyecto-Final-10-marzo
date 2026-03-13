---
name: Git Workflow - Version Control Best Practices
description: Guía para usar Git de manera profesional. Cubre desde comandos básicos hasta workflows avanzados, conventional commits, Git Flow, trunk-based development, resolución de conflictos y mejores prácticas para equipos.
scope: workflow
trigger: cuando se trabaje con Git, control de versiones, commits, branches, o flujos de trabajo en equipo
tools: view, file_create, str_replace, bash_tool
version: 1.0.0
---

# Git Workflow - Version Control Best Practices

## 🎯 Propósito

Guía para usar Git profesionalmente en equipo. Cubre comandos, Git Flow, conventional commits, PRs y resolución de conflictos.

## 📚 Configuración Inicial

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global core.editor "code --wait"

# Aliases útiles
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

## 🌿 Branches

```bash
# Crear y cambiar
git checkout -b feature/nueva-feature
git switch -c feature/nueva-feature   # Git 2.23+

# Listar / eliminar
git branch -a       # Todos (locales + remotos)
git branch -d feature/completed       # Safe delete
git branch -D feature/old             # Force delete

# Merge
git checkout main
git merge --no-ff feature/nueva-feature   # Siempre con no-ff para preservar historial

# Rebase (historial lineal)
git checkout feature/branch
git rebase main
git rebase -i HEAD~3   # Interactivo: reordenar, editar, squash
```

## 📝 Conventional Commits

```
<type>(<scope>): <subject>

<body opcional>

<footer opcional>
```

### Types

| Type | Uso |
|------|-----|
| `feat` | Nueva feature |
| `fix` | Bug fix |
| `docs` | Documentación |
| `refactor` | Refactor sin cambio de comportamiento |
| `test` | Agregar/modificar tests |
| `chore` | Tareas de mantenimiento |
| `perf` | Performance |
| `ci` | CI/CD configuration |
| `revert` | Revertir commit |

### Ejemplos

```bash
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(api): handle null response from users endpoint"
git commit -m "docs: update API authentication guide"

# Breaking change
git commit -m "feat(api)!: change response format

BREAKING CHANGE: API now returns data in {data, meta} format"

# Con body
git commit -m "refactor(database): optimize query performance

- Add index on user_id column
- Remove unnecessary joins
- Use connection pooling"
```

## 🔄 Git Flow

```
main        ← Production-ready
develop     ← Integration
feature/*   ← Features nuevas
release/*   ← Preparación de release
hotfix/*    ← Fixes críticos en producción
```

```bash
# Feature
git checkout develop
git checkout -b feature/user-profile
# ... cambios + commits ...
git checkout develop
git merge --no-ff feature/user-profile
git branch -d feature/user-profile

# Release
git checkout develop
git checkout -b release/1.2.0
git commit -m "chore(release): bump version to 1.2.0"
git checkout main && git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git checkout develop && git merge --no-ff release/1.2.0
git branch -d release/1.2.0

# Hotfix (desde main, mergear a main Y develop)
git checkout main
git checkout -b hotfix/critical-bug
git commit -m "fix(auth): resolve login timeout issue"
git checkout main && git merge --no-ff hotfix/critical-bug
git tag -a v1.2.1 -m "Hotfix 1.2.1"
git checkout develop && git merge --no-ff hotfix/critical-bug
git branch -d hotfix/critical-bug
```

## 🔀 Pull Requests

### Estructura del PR

```markdown
## Description
Qué hace este PR y por qué.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Tests pasan
- [ ] Self-review hecho
- [ ] No hay warnings nuevos
- [ ] Documentación actualizada
```

### Code Review

**Como Reviewer:** revisar en <24h, ser constructivo, sugerir con ejemplos, no nitpickear si hay linter.  
**Como Author:** PRs pequeños (<400 líneas), responder todos los comentarios, no tomar feedback personal.

## 🚨 Conflictos

```bash
# Durante merge/rebase — el archivo tendrá:
# <<<<<<< HEAD
# Tu código
# =======
# Código del otro branch
# >>>>>>> feature/branch

# Resolver: editar el archivo, luego:
git add file.txt
git commit          # Para merge
git rebase --continue  # Para rebase
```

## 🔧 Comandos Útiles

```bash
# Stash
git stash save "wip: descripcion"
git stash list
git stash pop        # Aplica y elimina
git stash apply stash@{2}

# Cherry-pick
git cherry-pick abc123

# Recuperar commit perdido
git reflog
git checkout -b recovered-branch abc123

# Historial limpio
git log --oneline --graph --all

# Deshacer
git restore file.txt          # Descartar cambios working dir
git restore --staged file.txt # Unstage
git reset HEAD~1              # Deshacer último commit (mantener cambios)
git reset --hard HEAD~1       # ⚠️ Deshacer y descartar cambios

# Tags
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin --tags
```

## 🚫 .gitignore Esencial

```bash
# Node / JS
node_modules/
.env
dist/
build/
*.log

# Python
__pycache__/
venv/
*.pyc

# OS & IDE
.DS_Store
.vscode/
.idea/
```

## ⚠️ Errores Comunes

| Error | Solución |
|-------|----------|
| `fatal: not a git repository` | `git init` |
| `Please commit or stash` | `git stash` o `git commit` |
| `refusing to merge unrelated histories` | `git pull --allow-unrelated-histories` |
| `CONFLICT` | Resolver manualmente y `git add` |

## 📋 Checklist Diario

- [ ] `git pull` antes de empezar a trabajar
- [ ] Crear branch para cada feature/fix
- [ ] Commits atómicos con conventional commits
- [ ] Push al menos una vez al día
- [ ] Sync con `develop`/`main` frecuentemente
- [ ] Eliminar branches después de merge

## 🎓 Best Practices

1. **Commit often** — Commits pequeños y frecuentes
2. **Conventional commits** — Mensajes descriptivos y estructurados
3. **Branch strategy** — Git Flow para proyectos estructurados
4. **Nunca forzar push a main/develop** — Proteger branches principales
5. **PRs pequeños** — Más fáciles de revisar
6. **Tag releases** — Versionar con semver
7. **Rebase antes de PR** — Historial limpio

---

*Versión: 1.0.0 | Scope: workflow | Standards: Conventional Commits, Git Flow*

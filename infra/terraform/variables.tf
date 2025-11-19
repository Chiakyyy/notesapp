variable "namespace" {
  type    = string
  default = "notesapp"
}

variable "frontend_image" {
  type    = string
  default = "registry.gitlab.com/youruser/notes-frontend:latest"
}

variable "api_image" {
  type    = string
  default = "registry.gitlab.com/youruser/notes-api:latest"
}

variable "db_image" {
  type    = string
  default = "postgres:16-alpine"
}

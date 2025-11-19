terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.27.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "notesapp" {
  metadata {
    name = var.namespace
  }
}

# Apply Deployments
resource "kubernetes_manifest" "notes_frontend_deploy" {
  manifest = yamldecode(file("${path.module}/deployments/frontend.yaml"))
}

resource "kubernetes_manifest" "notes_api_deploy" {
  manifest = yamldecode(file("${path.module}/deployments/api.yaml"))
}

resource "kubernetes_manifest" "notes_db_deploy" {
  manifest = yamldecode(file("${path.module}/deployments/db.yaml"))
}

# Apply Services
resource "kubernetes_manifest" "frontend_svc" {
  manifest = yamldecode(file("${path.module}/services/frontend-svc.yaml"))
}

resource "kubernetes_manifest" "api_svc" {
  manifest = yamldecode(file("${path.module}/services/api-svc.yaml"))
}

resource "kubernetes_manifest" "db_svc" {
  manifest = yamldecode(file("${path.module}/services/db-svc.yaml"))
}

# Apply Ingress
resource "kubernetes_manifest" "ingress" {
  manifest = yamldecode(file("${path.module}/ingress/ingress.yaml"))
}

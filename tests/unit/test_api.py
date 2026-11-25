import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend to path so we can import main
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../app/backend')))
from main import app

client = TestClient(app)

def test_get_menu():
    response = client.get("/api/menu")
    assert response.status_code == 200
    assert len(response.json()) >= 10

def test_login_success():
    response = client.post("/api/login", json={"username": "student1", "password": "pass", "role": "student"})
    assert response.status_code == 200
    assert "user_id" in response.json()

def test_login_fail_wrong_password():
    response = client.post("/api/login", json={"username": "student1", "password": "wrongpassword", "role": "student"})
    assert response.status_code == 401

def test_create_order_success():
    response = client.post("/api/orders", json={"student_id": 1, "item_id": 1, "quantity": 1})
    assert response.status_code == 200
    assert "order_id" in response.json()
    assert "total" in response.json()

def test_create_order_insufficient_stock():
    # Ordering 9999 items when stock is low
    response = client.post("/api/orders", json={"student_id": 1, "item_id": 1, "quantity": 9999})
    assert response.status_code == 400
    assert response.json()["detail"] == "Not enough stock"
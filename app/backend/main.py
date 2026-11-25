from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func
import database
from app.models import User, MenuItem, Order

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Campus Canteen API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str
    role: str

class OrderRequest(BaseModel):
    student_id: int
    item_id: int
    quantity: int

class MenuResponse(BaseModel):
    id: int
    name: str
    price: float
    stock: int
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    item_name: str
    quantity: int
    total_price: float
    status: str
    class Config:
        from_attributes = True

@app.get("/api/menu", response_model=List[MenuResponse])
def get_menu(db: Session = Depends(database.get_db)):
    return db.query(MenuItem).all()

@app.post("/api/login")
def login(req: LoginRequest, db: Session = Depends(database.get_db)):
    user = db.query(User).filter(User.username == req.username, User.role == req.role).first()
    if not user or user.password != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": user.id, "role": user.role}

@app.post("/api/orders")
def create_order(req: OrderRequest, db: Session = Depends(database.get_db)):
    item = db.query(MenuItem).filter(MenuItem.id == req.item_id).first()
    if not item or item.stock < req.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")
    
    total = item.price * req.quantity
    new_order = Order(
        student_id=req.student_id,
        item_id=req.item_id,
        quantity=req.quantity,
        status="pending",
        total_price=total
    )
    item.stock -= req.quantity
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return {"message": "Order placed", "order_id": new_order.id, "total": total}

# --- NEW ENDPOINTS FOR DASHBOARD FEATURES ---

@app.get("/api/orders/{student_id}")
def get_student_orders(student_id: int, db: Session = Depends(database.get_db)):
    orders = db.query(Order).filter(Order.student_id == student_id).all()
    result = []
    for o in orders:
        item = db.query(MenuItem).filter(MenuItem.id == o.item_id).first()
        result.append({
            "id": o.id,
            "item_name": item.name if item else "Unknown",
            "quantity": o.quantity,
            "total_price": o.total_price,
            "status": o.status
        })
    return result

@app.get("/api/reports/sales")
def get_sales_report(db: Session = Depends(database.get_db)):
    total_orders = db.query(Order).count()
    total_revenue = db.query(func.sum(Order.total_price)).scalar() or 0
    return {"total_orders": total_orders, "total_revenue": total_revenue}

    # Add this at the bottom of main.py
class StatusUpdate(BaseModel):
    status: str

@app.put("/api/orders/{order_id}/status")
def update_order_status(order_id: int, req: StatusUpdate, db: Session = Depends(database.get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = req.status
    db.commit()
    return {"message": "Status updated successfully", "new_status": order.status}
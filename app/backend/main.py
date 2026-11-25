from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
import database
from app.models import User, MenuItem, Order

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Campus Canteen API")

# THIS BLOCK FIXES THE LOGIN ISSUE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False, # MUST be False if allow_origins is ["*"]
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

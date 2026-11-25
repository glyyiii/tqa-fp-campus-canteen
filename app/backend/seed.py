from database import SessionLocal, engine
from app.models import User, MenuItem, Order
import database

def seed_data():
    database.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing menu items to update with the new list
    db.query(Order).delete()
    db.query(MenuItem).delete()
    db.commit()

    # Seed Users
    if not db.query(User).first():
        users = [
            User(username="student1", password="pass", role="student"),
            User(username="staff1", password="pass", role="staff"),
        ]
        db.add_all(users)

    # Seed Updated Menu (Matching your photos)
    items = [
        MenuItem(name="Pancit Canton", price=25.0, stock=50),
        MenuItem(name="Fried Chicken", price=45.0, stock=30),
        MenuItem(name="Fried Rice", price=25.0, stock=40),
        MenuItem(name="Siopao", price=20.0, stock=40),
        MenuItem(name="Lumpia", price=10.0, stock=80),
        MenuItem(name="Coke Mismo", price=20.0, stock=60),
        MenuItem(name="C2 Green Tea", price=25.0, stock=50),
        MenuItem(name="Iced Coffee", price=35.0, stock=30),
        MenuItem(name="Puto", price=5.0, stock=50),
        MenuItem(name="Spaghetti", price=40.0, stock=25),
        MenuItem(name="Pinaypay Banana", price=15.0, stock=40),
    ]
    db.add_all(items)
    db.commit()
    print("Database seeded successfully with new menu items!")
    db.close()

if __name__ == "__main__":
    seed_data()
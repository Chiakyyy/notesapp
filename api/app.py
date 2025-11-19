import os
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Autorise les appels depuis le frontend

DB_HOST = os.getenv("DB_HOST", "notes-db")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "notesdb")
DB_USER = os.getenv("DB_USER", "notesuser")
DB_PASSWORD = os.getenv("DB_PASSWORD", "notessecret")


def get_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
    )


@app.route("/notes", methods=["GET"])
def get_notes():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, content, created_at FROM notes ORDER BY created_at DESC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    notes = [
        {"id": r[0], "content": r[1], "created_at": r[2].isoformat()}
        for r in rows
    ]
    return jsonify(notes)


@app.route("/add", methods=["POST"])
def add_note():
    data = request.get_json()
    content = data.get("content", "").strip()

    if not content:
        return jsonify({"error": "Content is required"}), 400

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO notes (content) VALUES (%s) RETURNING id;", (content,))
    note_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"id": note_id, "content": content}), 201


@app.route("/delete/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM notes WHERE id = %s;", (note_id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "deleted", "id": note_id}), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
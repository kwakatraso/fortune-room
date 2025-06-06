import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    birth: "",
    birthTime: "",
    phone: "",
    email: "",
    password: "",
    role: "user", // 기본값
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const uid = userCredential.user.uid;

      // 사용자 정보 Firestore에 저장
      await setDoc(doc(db, "users", uid), {
        name: form.name,
        birth: form.birth,
        birthTime: form.birthTime,
        phone: form.phone,
        email: form.email,
        role: form.role,
      });

      alert("회원가입 완료!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("회원가입 실패: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">회원가입</h2>

        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="birth"
          placeholder="생년월일"
          value={form.birth}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="time"
          name="birthTime"
          placeholder="태어난 시각"
          value={form.birthTime}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="전화번호 (숫자만)"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="user">사용자</option>
          <option value="advisor">상담사</option>
        </select>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded"
        >
          회원가입
        </button>

        <p className="text-sm text-center text-gray-500">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="text-purple-600 underline">
            로그인
          </a>
        </p>
      </form>
    </div>
  );
}
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const uid = userCredential.user.uid;

      // 🔍 Firestore에서 사용자 role 확인
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        alert("로그인 성공!");

        // 역할에 따라 이동
        if (role === "user") {
          navigate("/user");
        } else if (role === "advisor") {
          navigate("/advisor");
        } else {
          navigate("/");
        }
      } else {
        alert("사용자 정보가 없습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("로그인 실패. 아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
          로그인
        </h2>

        <input
          type="email"
          name="email"
          placeholder="아이디 (이메일)"
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

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded"
        >
          로그인
        </button>

        <p className="text-sm text-center text-gray-500">
          아직 계정이 없으신가요?{" "}
          <a href="/signup" className="text-purple-600 underline">
            회원가입
          </a>
        </p>
      </form>
    </div>
  );
}
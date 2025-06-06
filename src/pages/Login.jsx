import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDocs, query, where, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ id: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Firestore에서 ID로 유저 문서 검색
      const q = query(collection(db, "users"), where("id", "==", form.id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("존재하지 않는 아이디입니다.");
        return;
      }

      const userData = snapshot.docs[0].data();
      const uid = snapshot.docs[0].id;
      const email = `${form.id}@user.com`;

      // Auth로 로그인 시도
      await signInWithEmailAndPassword(auth, email, form.password);

      alert("로그인 성공!");

      // 역할에 따라 이동
      if (userData.role === "user") {
        navigate("/user");
      } else if (userData.role === "advisor") {
        navigate("/advisor");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("로그인 실패. 아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-purple-100 via-white to-pink-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
          로그인
        </h2>

        <input
          type="text"
          name="id"
          placeholder="아이디 입력"
          value={form.id}
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

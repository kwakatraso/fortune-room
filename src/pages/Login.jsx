import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ id: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const fakeEmail = `${form.id}@user.com`;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        fakeEmail,
        form.password
      );
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        alert("❌ 사용자 정보가 존재하지 않습니다.");
        return;
      }

      const role = userDoc.data().role;
      alert("✅ 로그인 성공!");

      if (role === "user") {
        navigate("/user");
      } else if (role === "advisor") {
        navigate("/advisor");
      } else {
        alert("알 수 없는 사용자 유형입니다.");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("❌ 로그인 실패: 아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">로그인</h2>

        <input
          type="text"
          name="id"
          placeholder="아이디"
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

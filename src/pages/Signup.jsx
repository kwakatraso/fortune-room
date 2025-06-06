import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    id: "",
    password: "",
    name: "",
    birth: "",
    birthTime: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Firebase auth는 email이 필요하므로 아이디를 이메일 형식으로 변환
    const emailFake = `${form.id}@user.com`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailFake,
        form.password
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        id: form.id,
        name: form.name,
        birth: form.birth,
        birthTime: form.birthTime,
        phone: form.phone,
        role: "user", // 고정
      });

      alert("회원가입이 완료되었습니다!");
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

        <div>
          <label className="text-sm text-gray-600">아이디</label>
          <input
            type="text"
            name="id"
            placeholder="아이디 입력"
            value={form.id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호 입력"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">이름</label>
          <input
            type="text"
            name="name"
            placeholder="이름 입력"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">생년월일 (8자리)</label>
          <input
            type="text"
            name="birth"
            placeholder="예: 19990101"
            value={form.birth}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            pattern="\d{8}"
            title="8자리 숫자로 입력해주세요"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">태어난 시각 (선택)</label>
          <input
            type="text"
            name="birthTime"
            placeholder="예: 14:30 또는 모름"
            value={form.birthTime}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <div className="text-right mt-1">
            <button
              type="button"
              onClick={() => setForm({ ...form, birthTime: "모름" })}
              className="text-xs text-purple-600 underline"
            >
              시각을 모르겠어요
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">전화번호</label>
          <input
            type="tel"
            name="phone"
            placeholder="숫자만 입력 (예: 01012345678)"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

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
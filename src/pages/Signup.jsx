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
        <label className="text-sm text-gray-600">태어난 시각 (생시)</label>
        <select
            name="birthTime"
            value={form.birthTime}
            onChange={handleChange}
            className="w-full border p-2 rounded"
        >
            <option value="">-- 생시 선택 --</option>
            <option value="자시">자시 (23:30~1:30)</option>
            <option value="축시">축시 (1:30~3:30)</option>
            <option value="인시">인시 (3:30~5:30)</option>
            <option value="묘시">묘시 (5:30~7:30)</option>
            <option value="진시">진시 (7:30~9:30)</option>
            <option value="사시">사시 (9:30~11:30)</option>
            <option value="오시">오시 (11:30~13:30)</option>
            <option value="미시">미시 (13:30~15:30)</option>
            <option value="신시">신시 (15:30~17:30)</option>
            <option value="유시">유시 (17:30~19:30)</option>
            <option value="술시">술시 (19:30~21:30)</option>
            <option value="해시">해시 (21:30~23:30)</option>
            <option value="모름">모름</option>
        </select>

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
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, clearSuccessMessage } from "../store/categoriesSlice";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (successMessage) {
      setCategoryName(""); // Очищаем поле ввода при успешном добавлении
      setTimeout(() => {
        dispatch(clearSuccessMessage()); // Очищаем сообщение через 3 секунды
      }, 3000);
    }
  }, [successMessage, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim() === "") return; // Проверяем, что поле не пустое
    dispatch(addCategory(categoryName));
  };

  return (
    <div>
      <h1>Добавить категорию</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Название категории:
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Добавление..." : "Добавить категорию"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
    </div>
  );
};

export default AddCategory;

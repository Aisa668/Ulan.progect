import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  clearSuccessMessage,
} from "./categoriesSlice";

const Categories = () => {
  const dispatch = useDispatch();
  const { items, loading, error, successMessage } = useSelector(
    (state) => state.categories
  );

  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");

  const userRole = localStorage.getItem("role");
  const isAdmin = userRole && userRole.toUpperCase() === "ADMIN";

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000); // Очистка successMessage через 3 секунды
    }
  }, [successMessage, dispatch]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    dispatch(addCategory(newCategory));
    setNewCategory("");
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditedName(category.name);
  };

  const handleSaveEdit = () => {
    if (!editingCategory || !editedName.trim()) return;
    dispatch(
      updateCategory({ categoryId: editingCategory.id, newName: editedName })
    );
    setEditingCategory(null);
    setEditedName("");
  };

  const handleDeleteCategory = (categoryId) => {
    dispatch(deleteCategory(categoryId));
  };

  return (
    <div>
      <h1>Категории</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}

      {isAdmin && (
        <div>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Введите название категории"
          />
          <button onClick={handleAddCategory} disabled={loading}>
            {loading ? "Добавление..." : "Добавить категорию"}
          </button>
        </div>
      )}

      {loading && <div>Загрузка категорий...</div>}

      <ul>
        {items.map((category) => (
          <li key={category.id}>
            {editingCategory?.id === category.id ? (
              <>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <button onClick={handleSaveEdit} disabled={loading}>
                  Сохранить
                </button>
              </>
            ) : (
              <>
                {category.name}
                {isAdmin && (
                  <>
                    <button onClick={() => handleEditClick(category)}>
                      Изменить
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={loading}
                    >
                      Удалить
                    </button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;

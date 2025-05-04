  // Базовый URL для API, к которому будут отправляться запросы
  const apiBaseUrl = "http://localhost:8000";
 
        // Асинхронная функция для получения списка пользователей и обновления HTML-списка
        async function fetchUsers() {
          // Выполняем GET-запрос к API для получения списка пользователей
          const response = await fetch(`${apiBaseUrl}/users/`, {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          // Преобразуем ответ в JSON-формат
          const users = await response.json();
          // Получаем элемент списка пользователей по его ID
          const userList = document.getElementById("user-list");
          // Очищаем текущий список пользователей
          userList.innerHTML = "";
          // Проходим по каждому пользователю и добавляем его в HTML-список
          users.forEach((user) => {
            const li = document.createElement("li");
            li.textContent = `${user.id}: ${user.username} (${user.email})`;
            userList.appendChild(li);
          });
        }

        async function fetchUserme() {
          // Выполняем GET-запрос к API для получения списка пользователей
          const response = await fetch(`${apiBaseUrl}/users/me`, {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          // Преобразуем ответ в JSON-формат
          const user = await response.json();
          // Получаем элемент списка пользователей по его ID
          const userList = document.getElementById("user-me-list");
          // Очищаем текущий список пользователей
          userList.innerHTML = "";
          // Проходим по каждому пользователю и добавляем его в HTML-список
          for (const [key, value] of Object.entries(user)) {
            const li = document.createElement("li");
            li.textContent = `${key} - ${value}`;
            userList.appendChild(li);
        }
        }
  
  
        // Обработчик события отправки формы создания пользователя
        document.getElementById("create-user-form").addEventListener("submit", async (e) => {
          // Предотвращаем стандартное поведение формы (перезагрузку страницы)
          e.preventDefault();
          // Получаем значения полей формы
          const username = document.getElementById("username").value;
          const email = document.getElementById("email").value;
          const full_name = document.getElementById("full_name").value;
          const password = document.getElementById("password").value;
  
  
          // Отправляем POST-запрос на сервер для создания нового пользователя
          const response = await fetch(`${apiBaseUrl}/register/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, full_name, password }),
          });
  
  
          // Проверяем успешность операции и показываем сообщение пользователю
          if (response.ok) {
            alert("User created successfully");
            // Обновляем список пользователей
            fetchUsers();
          } else {
            alert("Error creating user");
          }
        });
  
  
        // Обработчик события отправки формы обновления пользователя
        document.getElementById("update-user-form").addEventListener("submit", async (e) => {
          // Предотвращаем стандартное поведение формы
          e.preventDefault();
          // Получаем значения полей формы
          const userId = document.getElementById("update-user-id").value;
          const username = document.getElementById("update-username").value;
          const email = document.getElementById("update-email").value;
          const full_name = document.getElementById("update-full_name").value;
          const password = document.getElementById("update-password").value;
  
  
          // Отправляем PUT-запрос на сервер для обновления данных пользователя
          const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ username, email, full_name, password }),
          });
        
  
          // Проверяем успешность операции и показываем сообщение пользователю
          if (response.ok) {
            alert("User updated successfully");
            // Обновляем список пользователей
            fetchUsers();
          } else {
            alert("Error updating user");
          }
        });
  
  
        // Обработчик события отправки формы удаления пользователя
        document.getElementById("delete-user-form").addEventListener("submit", async (e) => {
          // Предотвращаем стандартное поведение формы
          e.preventDefault();
          // Получаем ID пользователя для удаления
          const userId = document.getElementById("delete-user-id").value;
  
  
          // Отправляем DELETE-запрос на сервер для удаления пользователя
          const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
  
  
          // Проверяем успешность операции и показываем сообщение пользователю
          if (response.ok) {
            alert("User deleted successfully");
            // Обновляем список пользователей
            fetchUsers();
          } else {
            alert("Error deleting user");
          }
        });
        let accessToken = '';   
        document.getElementById("auth-user-form").addEventListener("submit", async (e) => {
            // Предотвращаем стандартное поведение формы
            e.preventDefault();
            // Получаем значения полей формы
            const username = document.getElementById("auth_username").value;
            const password = document.getElementById("auth_password").value;
    
    
            // Отправляем PUT-запрос на сервер для обновления данных пользователя
            try {const response = await fetch(`/token`, {
              method: "POST",
              headers: {
                Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: "Basic Og==",
              },
              body: new URLSearchParams({
                grant_type: "password",
                username: username,
                password: password,
              }),
            });
            const data = await response.json();
            console.log(data);
            if (data.access_token) {
                alert("Успешный вход! Токен: " + data.access_token);
                localStorage.setItem('token', data.access_token)
              } else {
                alert("Ошибка входа!");
              }
            } catch (error) {
              console.error("Ошибка запроса:", error);
              alert("Ошибка запроса!");
            }
          });
    
        // При загрузке страницы выполняем начальное получение списка пользователей
        fetchUsers();
        
        async function getUserInfo() {
          if (!localStorage.getItem('token')) {
              document.getElementById('userInfo').textContent = "Сначала войдите в систему!";
              return;
          }


          const response = await fetch(`${apiBaseUrl}/users/me`, {
              method: 'GET',
              headers: { 'Authorization': `Bearer ${accessToken}` }
          });


          const data = await response.json();
          document.getElementById('userInfo').textContent = JSON.stringify(data, null, 2);
      }

       
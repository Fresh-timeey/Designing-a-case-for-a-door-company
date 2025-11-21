// Система пользователей и авторизации
class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('doorUsers')) || [
            { id: 1, login: 'admin', password: '1111', name: 'Администратор', role: 'admin' },
            { id: 2, login: 'worker', password: '1111', name: 'Мастер Сергей', role: 'worker' },
            { id: 3, login: 'user', password: '1111', name: 'Иван Иванов', role: 'user' }
        ];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.saveUsers();
    }

    register(login, password, name) {
        if (this.users.find(u => u.login === login)) {
            return { success: false, message: 'Пользователь с таким логином уже существует' };
        }

        const newUser = {
            id: Date.now(),
            login,
            password,
            name,
            role: 'user' // При регистрации всегда создается обычный пользователь
        };

        this.users.push(newUser);
        this.saveUsers();
        return { success: true, message: 'Регистрация успешна' };
    }

    login(login, password) {
        const user = this.users.find(u => u.login === login && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));



            location.reload();
            
            
            
            
            return { success: true, user };
        }
        return { success: false, message: 'Неверный логин или пароль' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    saveUsers() {
        localStorage.setItem('doorUsers', JSON.stringify(this.users));
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

     // Получить всех пользователей (кроме текущего админа)
    getAllUsers() {
        const currentUser = this.getCurrentUser();
        return this.users.filter(user => user.id !== currentUser?.id);
    }

    deleteUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);
        this.saveUsers();
    }
 // Обновить пользователя
    updateUser(userId, updatedFields) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) return false;

        this.users[userIndex] = { ...this.users[userIndex], ...updatedFields };
        this.saveUsers();
        return true;
    }
    // Проверка ролей
    isAdmin(user = this.currentUser) {
        return user && user.role === 'admin';
    }

    isWorker(user = this.currentUser) {
        return user && user.role === 'worker';
    }

    isUser(user = this.currentUser) {
        return user && user.role === 'user';
    }
}



























// Класс для управления заказами
class DoorOrderCollection {
    constructor() {
        // Загружаем заказы из localStorage или используем демо-данные
        const savedOrders = JSON.parse(localStorage.getItem('doorOrders'));
        if (savedOrders && savedOrders.length > 0) {
            this._orders = savedOrders.map(order => ({
                ...order,
                createdAt: new Date(order.createdAt)
            }));
        } else {
            this._orders = this._createDemoOrders();
            this._saveToStorage();
        }
    }

    











    _createDemoOrders() {
        return [
            {
                id: 'ORD-001',
                description: 'Входная дверь с бронированием',
                createdAt: new Date('2025-01-15'),
                author: 'Иван Иванов',
                type: 'Металлическая',
                size: '200x90',
                address: 'г. Москва, ул. Ленина, д. 10, кв. 5',
                paymentMethod: 'Безналичный перевод',
                contact: '+7-999-123-45-67',
                status: 'В работе'
            },
            {
                id: 'ORD-002',
                description: 'Межкомнатная дверь со стеклянными вставками',
                createdAt: new Date('2025-01-16'),
                author: 'Петр Петров',
                type: 'Деревянная',
                size: '190x80',
                address: 'г. Москва, ул. Пушкина, д. 25, кв. 12',
                paymentMethod: 'Наличные мастеру',
                contact: 'petr@mail.ru',
                status: 'Новый'
            },
            {
                id: 'ORD-003',
                description: 'Дверь для офиса',
                createdAt: new Date('2025-01-17'),
                author: 'ООО "Компания"',
                type: 'Пластиковая',
                size: '210x95',
                address: 'г. Москва, пр. Мира, д. 50, офис 305',
                paymentMethod: 'Безналичный перевод',
                contact: 'office@company.ru',
                status: 'Завершено'
            }
        ];
    }

     _saveToStorage() {
        localStorage.setItem('doorOrders', JSON.stringify(this._orders));
    }

    _validateId(id) {
        return typeof id === 'string' && id.trim() !== '';
    }

    _validateDescription(description) {
        return typeof description === 'string' && description.length > 0 && description.length < 200;
    }

    _validateAuthor(author) {
        return typeof author === 'string' && author.trim() !== '';
    }

    _validateDate(date) {
        return date instanceof Date && !isNaN(date);
    }

    _validateType(type) {
        const validTypes = ['Металлическая', 'Деревянная', 'Пластиковая'];
        return validTypes.includes(type);
    }

    _validateSize(size) {
        return typeof size === 'string' && /^\d+x\d+$/.test(size);
    }

    _validateAddress(address) {
        return typeof address === 'string' && address.trim() !== '';
    }

    _validatePaymentMethod(method) {
        const validMethods = ['Наличные мастеру', 'Безналичный перевод', 'Переносная касса'];
        return validMethods.includes(method);
    }

    _validateContact(contact) {
        return typeof contact === 'string' && contact.trim() !== '';
    }

    validateOrder(order) {
        if (!order || typeof order !== 'object') return false;

        const requiredFields = [
            'id', 'description', 'createdAt', 'author', 
            'type', 'size', 'address', 'paymentMethod', 'contact'
        ];

        for (let field of requiredFields) {
            if (!order.hasOwnProperty(field)) return false;
        }

        return this._validateId(order.id) &&
               this._validateDescription(order.description) &&
               this._validateAuthor(order.author) &&
               this._validateDate(order.createdAt) &&
               this._validateType(order.type) &&
               this._validateSize(order.size) &&
               this._validateAddress(order.address) &&
               this._validatePaymentMethod(order.paymentMethod) &&
               this._validateContact(order.contact);
    }

 getOrders(skip = 0, top = 50, filterConfig = {}, forUser = null) {
    if (typeof skip !== 'number' || typeof top !== 'number' || skip < 0 || top < 0) {
        return [];
    }

    let filteredOrders = [...this._orders];

    // Фильтрация по пользователю (только для обычных пользователей)
    if (forUser && forUser.role === 'user') {
        filteredOrders = filteredOrders.filter(order => order.author === forUser.name);
    }
    // Работники и админы видят ВСЕ заказы - никакой дополнительной фильтрации

    // Применяем дополнительные фильтры
    if (Object.keys(filterConfig).length > 0) {
        filteredOrders = filteredOrders.filter(order => {
            for (let key in filterConfig) {
                if (order[key] !== filterConfig[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    // Сортируем по дате создания (сначала новые)
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filteredOrders.slice(skip, skip + top);
}

    getOrder(id) {
        if (!this._validateId(id)) return null;
        return this._orders.find(order => order.id === id) || null;
    }

    addOrder(order) {
        if (!this.validateOrder(order)) return false;
        
        if (this._orders.some(existingOrder => existingOrder.id === order.id)) {
            return false;
        }

        this._orders.push(order);
        this._saveToStorage();
        return true;
    }

    editOrder(id, updatedFields) {
        if (!this._validateId(id)) return false;

        const orderIndex = this._orders.findIndex(order => order.id === id);
        if (orderIndex === -1) return false;

        const originalOrder = this._orders[orderIndex];
        
        const forbiddenFields = ['id', 'author', 'createdAt'];
        for (let field of forbiddenFields) {
            if (updatedFields.hasOwnProperty(field)) {
                return false;
            }
        }

        const updatedOrder = { ...originalOrder, ...updatedFields };

        if (!this.validateOrder(updatedOrder)) {
            return false;
        }

        this._orders[orderIndex] = updatedOrder;
        this._saveToStorage();
        return true;
    }

    removeOrder(id) {
        if (!this._validateId(id)) return false;

        const initialLength = this._orders.length;
        this._orders = this._orders.filter(order => order.id !== id);
        this._saveToStorage();
        
        return this._orders.length < initialLength;
    }

    getOrdersCount() {
        return this._orders.length;
    }

    // Получить все заказы (для админа и работника)
    getAllOrders() {
        return this._orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}

// Класс для управления интерфейсом
class DoorOrderView {
    constructor(collection, userManager) {
        this.collection = collection;
        this.userManager = userManager;
        this.currentFilter = {};
    }

_reinitForms() {
    console.log('Переинициализация форм заказа');
    
    // Переинициализируем формы заказа
    const orderForms = document.querySelectorAll('#order form, #welcome .order-block form');
    orderForms.forEach(form => {
        // Удаляем старые обработчики
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        // Добавляем новые обработчики
        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Форма отправлена (reinit)');
            this._handleOrderSubmit(newForm);
        });
    });

    // Также переинициализируем другие важные формы
    const editForm = document.getElementById('editOrderForm');
    if (editForm) {
        editForm.onsubmit = (e) => {
            e.preventDefault();
            this._handleEditSubmit();
        };
    }
}
    init() {
        this.updateUI();
        this.renderOrders();
        this._initEventListeners();
    }

   updateUI() {
    const user = this.userManager.getCurrentUser();
    const authBlock = document.querySelector('.auth-block');
    const userInfo = document.getElementById('userInfo');
    const adminBtn = document.getElementById('adminBtn');
    const roleInfo = document.getElementById('userRole');

    if (user) {
        // Пользователь авторизован
        authBlock.style.display = 'none';
        userInfo.style.display = 'block';
        document.getElementById('userName').textContent = user.name;
        
        // Отображаем роль пользователя
        if (roleInfo) {
            const roleNames = {
                'admin': 'Администратор',
                'worker': 'Работник компании',
                'user': 'Клиент'
            };
            roleInfo.textContent = roleNames[user.role];
            roleInfo.className = `role-${user.role}`;
        }

        // Настройка видимости кнопок в зависимости от роли
        if (this.userManager.isAdmin()) {
            adminBtn.style.display = 'block';
        } else {
            adminBtn.style.display = 'none';
        }

        // ОСОБЕННОСТЬ ДЛЯ РАБОТНИКА: показываем заказы на главной
        if (this.userManager.isWorker()) {
            this.renderWorkerOrders();
        }

        // ПЕРЕИНИЦИАЛИЗИРУЕМ ФОРМЫ ПОСЛЕ ОБНОВЛЕНИЯ UI
        setTimeout(() => {
            this._reinitForms();
        }, 100);

        // Настройка видимости элементов в зависимости от роли
        this._updateRoleBasedUI();
    } else {
        // Пользователь не авторизован
        authBlock.style.display = 'block';
        userInfo.style.display = 'none';
        adminBtn.style.display = 'none';

        // Удаляем контейнер заказов работника если есть
        const workerContainer = document.getElementById('workerOrdersContainer');
        if (workerContainer) {
            workerContainer.remove();
        }

        // Скрываем все защищенные элементы
        document.querySelectorAll('.auth-required').forEach(el => {
            el.style.display = 'none';
        });
    }
}

  _updateRoleBasedUI() {
    const user = this.userManager.getCurrentUser();
    if (!user) return;

    // Находим элементы навигации
    const orderTab = document.querySelector('[data-page="order"]');
    const viewTab = document.querySelector('[data-page="view"]');
    
    // Для работника и админа показываем все заказы, для пользователя - только свои
    const pageTitle = document.querySelector('#view h2');
    if (pageTitle && (this.userManager.isAdmin() || this.userManager.isWorker())) {
        pageTitle.textContent = 'Все заказы';
    } else if (pageTitle) {
        pageTitle.textContent = 'Мои заказы';
    }

    // НАСТРОЙКА ВИДИМОСТИ ВКЛАДОК НАВИГАЦИИ
    if (this.userManager.isWorker()) {
        // Работник: скрыть "Сделать заказ", показать "Все заказы"
        if (orderTab) orderTab.style.display = 'none';
        if (viewTab) {
            viewTab.style.display = 'block';
            viewTab.textContent = 'Все заказы';
        }
    } else if (this.userManager.isAdmin()) {
        // Админ: показать обе вкладки
        if (orderTab) orderTab.style.display = 'block';
        if (viewTab) {
            viewTab.style.display = 'block';
            viewTab.textContent = 'Все заказы';
        }
    } else {
        // Обычный пользователь: показать обе вкладки
        if (orderTab) orderTab.style.display = 'block';
        if (viewTab) {
            viewTab.style.display = 'block';
            viewTab.textContent = 'Мои заказы';
        }
    }

    // Настройка видимости элементов создания заказа
    const orderElements = document.querySelectorAll('.order-block');
    if (this.userManager.isWorker()) {
        // Работник не может создавать заказы
        orderElements.forEach(el => el.style.display = 'none');
    } else {
        orderElements.forEach(el => el.style.display = 'block');
    }
}



showSuccessModal() {
    document.getElementById('successModal').style.display = 'block';
}

hideSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    // Переходим на вкладку "Мои заказы"
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('view').classList.add('active');
    // Обновляем список заказов
    this.renderOrders();
}



    renderOrders(containerId = 'ordersTableBody') {

        const searchInput = document.querySelector('#view input[type="text"][placeholder*="номер заказа"]');
        if(searchInput){
            searchInput.value='';
        }

        const container = document.getElementById(containerId);
        if (!container) return;

        const user = this.userManager.getCurrentUser();
        const orders = this.collection.getOrders(0, 50, this.currentFilter, user);
        
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Заказы не найдены</td></tr>';
            return;
        }

        orders.forEach(order => {
            const row = this._createOrderRow(order);
            container.appendChild(row);
        });
    }

    _createOrderRow(order) {
        const row = document.createElement('tr');
        row.dataset.orderId = order.id;
        
        const user = this.userManager.getCurrentUser();
        const canEdit = user && (this.userManager.isAdmin() || this.userManager.isWorker() || user.name === order.author);
        const canDelete = user && (this.userManager.isAdmin() || user.name === order.author);
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.type}</td>
            <td>${order.description}</td>
            <td>${order.address}</td>
            <td class="status-cell">
                <span class="status-badge status-${order.status || 'Новый'}">${order.status || 'Новый'}</span>
            </td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td class="actions-cell">
                ${canEdit ? `<button class="btn-edit" onclick="app.view.showEditModal('${order.id}')">✏️</button>` : ''}
                ${canDelete ? `<button class="btn-delete" onclick="app.view.confirmDelete('${order.id}')">🗑️</button>` : ''}
            </td>
        `;

        return row;
    }

    showEditModal(orderId) {
        const order = this.collection.getOrder(orderId);
        const user = this.userManager.getCurrentUser();
        
        if (order) {
            document.getElementById('editOrderId').value = order.id;
            document.getElementById('editOrderType').value = order.type;
            document.getElementById('editOrderDescription').value = order.description;
            document.getElementById('editOrderStatus').value = order.status || 'Новый';
            document.getElementById('editOrderAddress').value = order.address;
            document.getElementById('editOrderSize').value = order.size;
            document.getElementById('editOrderPayment').value = order.paymentMethod;
            document.getElementById('editOrderContact').value = order.contact;
            
            // Настройка доступности полей в зависимости от роли
            if (this.userManager.isWorker() && order.author !== user.name) {
                // Работник может менять только статус чужих заказов
                document.getElementById('editOrderType').disabled = true;
                document.getElementById('editOrderDescription').disabled = true;
                document.getElementById('editOrderAddress').disabled = true;
                document.getElementById('editOrderSize').disabled = true;
                document.getElementById('editOrderPayment').disabled = true;
                document.getElementById('editOrderContact').disabled = true;
            } else {
                // Админ и автор заказа могут менять все
                document.getElementById('editOrderType').disabled = false;
                document.getElementById('editOrderDescription').disabled = false;
                document.getElementById('editOrderAddress').disabled = false;
                document.getElementById('editOrderSize').disabled = false;
                document.getElementById('editOrderPayment').disabled = false;
                document.getElementById('editOrderContact').disabled = false;
            }
            
            document.getElementById('editModal').style.display = 'block';
        }
    }

    hideEditModal() {
        document.getElementById('editModal').style.display = 'none';
        // Сбрасываем disabled состояния
        const form = document.getElementById('editOrderForm');
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => input.disabled = false);
    }

    confirmDelete(orderId) {
        if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
            app.removeOrder(orderId);
        }
    }

    applyFilters(filters) {
        this.currentFilter = { ...this.currentFilter, ...filters };
        this.renderOrders();
    }

    clearFilters() {
        this.currentFilter = {};
        this.renderOrders();
    }

    updateOrderInDOM(orderId) {
        this.renderOrders();
    }

    removeOrderFromDOM(orderId) {
        this.renderOrders();
    }

    renderAdminUsers() {
        const container = document.getElementById('adminUsersList');
        if (!container) return;

        const users = this.userManager.getAllUsers();
        container.innerHTML = '';

        if (users.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 20px;">Пользователи не найдены</div>';
            return;
        }

        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.innerHTML = `
                <div class="user-info">
                    <strong>${user.name}</strong>
                    <div class="user-details">
                        Логин: ${user.login} | 
                        Роль: <span class="role-badge role-${user.role}">${this._getRoleName(user.role)}</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn-edit" onclick="app.showEditUserModal(${user.id})">✏️</button>
                    <button class="btn-delete" onclick="app.deleteUser(${user.id})">🗑️</button>
                </div>
            `;
            container.appendChild(userDiv);
        });
    }

    _getRoleName(role) {
        const roleNames = {
            'admin': 'Администратор',
            'worker': 'Работник',
            'user': 'Пользователь'
        };
        return roleNames[role] || role;
    }

    showEditUserModal(userId) {
        const user = this.userManager.users.find(u => u.id === userId);
        if (user) {
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUserName').value = user.name;
            document.getElementById('editUserLogin').value = user.login;
            document.getElementById('editUserPassword').value = user.password;
            document.getElementById('editUserRole').value = user.role;
            
            document.getElementById('editUserModal').style.display = 'block';
        }
    }

    hideEditUserModal() {
        document.getElementById('editUserModal').style.display = 'none';
    }

    renderAdminOrders() {
        const container = document.getElementById('adminOrdersList');
        if (!container) return;

        const orders = this.collection.getAllOrders();
        container.innerHTML = '';

        if (orders.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 20px;">Заказы не найдены</div>';
            return;
        }

        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-item';
            orderDiv.innerHTML = `
                <div class="order-info">
                    <strong>${order.id}</strong> - ${order.type} 
                    <br>Клиент: ${order.author}
                    <br>Статус: <span class="status-badge status-${order.status || 'Новый'}">${order.status || 'Новый'}</span>
                    <br><small>${order.description}</small>
                </div>
                <div class="order-actions">
                    <button class="btn-edit" onclick="app.view.showEditModal('${order.id}')">✏️</button>
                    <button class="btn-delete" onclick="app.view.confirmDelete('${order.id}')">🗑️</button>
                </div>
            `;
            container.appendChild(orderDiv);
        });
    }




showSuccessModal() {
    document.getElementById('successModal').style.display = 'block';
}

hideSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    // Переходим на вкладку "Мои заказы"
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('view').classList.add('active');
    // Обновляем список заказов
    this.renderOrders();
}







_initEventListeners() {
    // Обработчики для форм заказов - УЛУЧШЕННАЯ ВЕРСИЯ
    const orderForms = document.querySelectorAll('#order form, #welcome .order-block form');
    orderForms.forEach(form => {
        // Удаляем старые обработчики и добавляем новые
        form.onsubmit = null; // Очищаем старый обработчик
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Форма отправлена'); // Для отладки
            this._handleOrderSubmit(form);
        });
    });
// Обработчик для кнопки в модальном окне успеха
document.querySelector('#successModal button')?.addEventListener('click', () => {
    this.hideSuccessModal();
});
    // Обработчик формы редактирования заказа
    const editForm = document.getElementById('editOrderForm');
    if (editForm) {
        editForm.onsubmit = null;
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this._handleEditSubmit();
        });
    }

    // Обработчик формы редактирования пользователя
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.onsubmit = null;
        editUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this._handleEditUserSubmit();
        });
    }

    // Закрытие модальных окон
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        };
    });

    // Обработчик для закрытия модального окна успеха
    document.getElementById('closeSuccess')?.addEventListener('click', () => {
        this.hideSuccessModal();
    });

    // Фильтрация
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.onchange = (e) => {
            if (e.target.value) {
                this.applyFilters({ type: e.target.value });

            } else {
                this.clearFilters();
            }
        };
    }

    // Поиск заказа
    const searchForm = document.querySelector('#view form');
    if (searchForm) {
        searchForm.onsubmit = (e) => {
            e.preventDefault();
            const orderId = searchForm.querySelector('input[type="text"]').value;
            if (orderId) {
                const order = this.collection.getOrder(orderId);
                if (order) {
                    this.applyFilters({ id: orderId });
                } else {
                    alert('Заказ не найден');
                }
           
            }
        
        };
    }

    // ДОБАВЛЯЕМ ОБРАБОТЧИКИ ДЛЯ ФОРМ РАБОТНИКА
    const workerTypeFilter = document.getElementById('workerTypeFilter');
    if (workerTypeFilter) {
        workerTypeFilter.onchange = (e) => {
            this.applyWorkerFilters({ type: e.target.value });
        };
    }

    const workerStatusFilter = document.getElementById('workerStatusFilter');
    if (workerStatusFilter) {
        workerStatusFilter.onchange = (e) => {
            this.applyWorkerFilters({ status: e.target.value });
        };
    }
}
 _handleOrderSubmit(form) {
    console.log('Обработка отправки формы заказа');
    
    const user = this.userManager.getCurrentUser();
    if (!user) {
        alert('Для создания заказа необходимо авторизоваться');
        return;
    }

    if (this.userManager.isWorker()) {
        alert('Работники не могут создавать заказы');
        return;
    }

    // Получаем данные из формы более надежным способом
    const formData = new FormData(form);
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Собираем данные из формы
    const orderData = {
        type: form.querySelector('select').value,
        size: form.querySelector('input[type="text"][placeholder*="200x90"]').value,
        description: form.querySelector('input[placeholder*="бордовой"], input[placeholder*="обшивкой"]').value,
        address: form.querySelector('input[placeholder*="адрес"], input[placeholder*="Москва"]').value,
        paymentMethod: Array.from(form.querySelectorAll('select'))[1]?.value || form.querySelector('select').value,
        contact: form.querySelector('input[placeholder*="телефона"], input[placeholder*="email"]').value,
        status: 'Новый',
        author: user.name
    };

    console.log('Собранные данные:', orderData);

    // Проверяем заполнение всех полей
    const requiredFields = ['type', 'size', 'description', 'address', 'paymentMethod', 'contact'];
    const emptyFields = requiredFields.filter(field => !orderData[field] || orderData[field].trim() === '');
    
    if (emptyFields.length > 0) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }

    // Проверяем формат размера
    if (!/\d+x\d+/.test(orderData.size)) {
        alert('Размер должен быть в формате 200x90');
        return;
    }

    console.log('Создаем заказ с данными:', orderData);

    if (app.addOrder(orderData)) {
        form.reset();
        console.log('Заказ успешно создан');
        this.showSuccessModal();
    } else {
        console.error('Ошибка при создании заказа');
        alert('Ошибка при создании заказа. Проверьте правильность заполнения полей.');
    }
}

    _handleEditSubmit() {
        const orderId = document.getElementById('editOrderId').value;
        const user = this.userManager.getCurrentUser();
        const order = this.collection.getOrder(orderId);

        let updatedFields = {};

        if (this.userManager.isWorker() && order.author !== user.name) {
            // Работник может менять только статус чужих заказов
            updatedFields = {
                status: document.getElementById('editOrderStatus').value
            };
        } else {
            // Админ и автор заказа могут менять все поля
            updatedFields = {
                type: document.getElementById('editOrderType').value,
                description: document.getElementById('editOrderDescription').value,
                status: document.getElementById('editOrderStatus').value,
                address: document.getElementById('editOrderAddress').value,
                size: document.getElementById('editOrderSize').value,
                paymentMethod: document.getElementById('editOrderPayment').value,
                contact: document.getElementById('editOrderContact').value
            };
        }

        if (app.editOrder(orderId, updatedFields)) {
            this.hideEditModal();
            alert('Заказ успешно обновлен!');
        } else {
            alert('Ошибка при обновлении заказа');
        }
    }

    _handleEditUserSubmit() {
        const userId = parseInt(document.getElementById('editUserId').value);
        const updatedFields = {
            name: document.getElementById('editUserName').value,
            login: document.getElementById('editUserLogin').value,
            password: document.getElementById('editUserPassword').value,
            role: document.getElementById('editUserRole').value
        };

        if (app.editUser(userId, updatedFields)) {
            this.hideEditUserModal();
            this.renderAdminUsers();
            alert('Пользователь успешно обновлен!');
        } else {
            alert('Ошибка при обновлении пользователя');
        }
    }




renderWorkerOrders() {
    const welcomeSection = document.getElementById('welcome');
    if (!welcomeSection) return;

    // Создаем или находим контейнер для заказов работника
    let ordersContainer = document.getElementById('workerOrdersContainer');
    if (!ordersContainer) {
        ordersContainer = document.createElement('div');
        ordersContainer.id = 'workerOrdersContainer';
        ordersContainer.className = 'card';
        welcomeSection.appendChild(ordersContainer);
    }

    const user = this.userManager.getCurrentUser();
    const orders = this.collection.getAllOrders();
    
    ordersContainer.innerHTML = `
        <h3>Все заказы для выполнения</h3>
        <div class="filters">
            <select id="workerTypeFilter">
                <option value="">Все типы</option>
                <option value="Металлическая">Металлическая</option>
                <option value="Деревянная">Деревянная</option>
                <option value="Пластиковая">Пластиковая</option>
            </select>
            <select id="workerStatusFilter">
                <option value="">Все статусы</option>
                <option value="Новый">Новый</option>
                <option value="В работе">В работе</option>
                <option value="Завершено">Завершено</option>
            </select>
            <button onclick="app.view.clearWorkerFilters()">Сбросить</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Тип двери</th>
                    <th>Описание</th>
                    <th>Адрес</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody id="workerOrdersTableBody">
                ${this._createWorkerOrdersRows(orders)}
            </tbody>
        </table>
    `;

    // Добавляем обработчики фильтров
    document.getElementById('workerTypeFilter').onchange = (e) => {
        this.applyWorkerFilters({ type: e.target.value });
    };
    document.getElementById('workerStatusFilter').onchange = (e) => {
        this.applyWorkerFilters({ status: e.target.value });
    };
}

_createWorkerOrdersRows(orders) {
    if (orders.length === 0) {
        return '<tr><td colspan="7" style="text-align: center; padding: 20px;">Заказы не найдены</td></tr>';
    }

    return orders.map(order => `
        <tr class="order-row ${order.status === 'Завершено' ? 'completed-order' : ''}" data-order-id="${order.id}">
            <td>${order.id}</td>
            <td>${order.type}</td>
            <td>${order.description}</td>
            <td>${order.address}</td>
            <td class="status-cell">
                <span class="status-badge status-${order.status || 'Новый'}">${order.status || 'Новый'}</span>
            </td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td class="actions-cell">
                <button class="btn-complete" onclick="app.view.completeOrder('${order.id}')" 
                    ${order.status === 'Завершено' ? 'disabled' : ''}>
                    ${order.status === 'Завершено' ? '✅' : '☑️'}
                </button>
                <button class="btn-edit" onclick="app.view.showEditModal('${order.id}')">✏️</button>
            </td>
        </tr>
    `).join('');
}

completeOrder(orderId) {
    if (confirm('Отметить заказ как выполненный?')) {
        const updatedFields = { status: 'Завершено' };
        if (app.editOrder(orderId, updatedFields)) {
            this.renderWorkerOrders();
            alert('Заказ отмечен как выполненный!');
        }
    }
}

applyWorkerFilters(filters) {
    const orders = this.collection.getAllOrders();
    let filteredOrders = [...orders];
    
    if (filters.type) {
        filteredOrders = filteredOrders.filter(order => order.type === filters.type);
    }
    
    if (filters.status) {
        filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }
    
    document.getElementById('workerOrdersTableBody').innerHTML = this._createWorkerOrdersRows(filteredOrders);
}

clearWorkerFilters() {
    document.getElementById('workerTypeFilter').value = '';
    document.getElementById('workerStatusFilter').value = '';
    this.renderWorkerOrders();
}


}

// Глобальный объект приложения
const app = {
    userManager: null,
    collection: null,
    view: null,
    
    init() {
        this.userManager = new UserManager();
        this.collection = new DoorOrderCollection();
        this.view = new DoorOrderView(this.collection, this.userManager);
        
        this.view.init();
        this._initAuthHandlers();
        this._initAdminHandlers();
        
        console.log('Приложение инициализировано');
        console.log('Тестовые аккаунты:');
        console.log('- Админ: admin/1111');
        console.log('- Работник: worker/1111');
        console.log('- Пользователь: user/1111');
    },
    
    // Методы для заказов
    addOrder(orderData) {
    console.log('Метод addOrder вызван с данными:', orderData);
    
    const newOrder = {
        id: `ORD-${String(this.collection.getOrdersCount() + 1).padStart(3, '0')}`,
        createdAt: new Date(),
        ...orderData
    };
    
    console.log('Новый заказ для добавления:', newOrder);
    
    if (this.collection.addOrder(newOrder)) {
        console.log('Заказ успешно добавлен в коллекцию');
        this.view.updateOrderInDOM(newOrder.id);
        return true;
    } else {
        console.error('Ошибка добавления заказа в коллекцию');
        return false;
    }
},
    
    removeOrder(orderId) {
        if (this.collection.removeOrder(orderId)) {
            this.view.removeOrderFromDOM(orderId);
            return true;
        }
        return false;
    },
    
    editOrder(orderId, updatedFields) {
        if (this.collection.editOrder(orderId, updatedFields)) {
            this.view.updateOrderInDOM(orderId);
            return true;
        }
        return false;
    },
    
    // Методы для пользователей
    register(login, password, name) {
        const result = this.userManager.register(login, password, name);
        return result;
    },
    
    login(login, password) {
        const result = this.userManager.login(login, password);
        if (result.success) {
            this.view.updateUI();
            this.view.renderOrders();
        }
        return result;
    },
    
    logout() {
        this.userManager.logout();
        this.view.updateUI();
        this.view.renderOrders();
        // Переходим на главную страницу после выхода
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('welcome').classList.add('active');
    },
    
    deleteUser(userId) {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            this.userManager.deleteUser(userId);
            this.view.renderAdminUsers();
        }
    },

    editUser(userId, updatedFields) {
        return this.userManager.updateUser(userId, updatedFields);
    },

    showEditUserModal(userId) {
        this.view.showEditUserModal(userId);
    },
    
    // Инициализация обработчиков
    _initAuthHandlers() {
        // Форма входа
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const login = document.getElementById('login').value;
            const password = document.getElementById('password').value;
            const result = this.login(login, password);
            
            if (!result.success) {
                alert(result.message);
            }
        });

        // Форма регистрации
        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const login = document.getElementById('regLogin').value;
            const password = document.getElementById('regPassword').value;
            const name = document.getElementById('regName').value;
            const result = this.register(login, password, name);
            
            alert(result.message);
            if (result.success) {
                document.getElementById('registerModal').style.display = 'none';
                // Очищаем форму регистрации
                document.getElementById('registerForm').reset();
            }
        });

        // Кнопка выхода
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });

        // Переключение между входом и регистрацией
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerModal').style.display = 'block';
        });

        document.getElementById('closeRegister')?.addEventListener('click', () => {
            document.getElementById('registerModal').style.display = 'none';
        });
    },
    
    _initAdminHandlers() {
        // Панель администратора
        document.getElementById('adminBtn')?.addEventListener('click', () => {
            document.getElementById('adminPanel').style.display = 'block';
            this.view.renderAdminUsers();
            this.view.renderAdminOrders();
        });

        document.getElementById('closeAdmin')?.addEventListener('click', () => {
            document.getElementById('adminPanel').style.display = 'none';
        });

        // Закрытие модальных окон при клике вне их
        window.addEventListener('click', (event) => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }
};

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Экспорт для использования в консоли
window.app = app;
// Dữ liệu danh sách phòng trọ mẫu thích hợp HSSV và Công nhân
const roomsData = [
    {
        id: 1,
        name: "Phòng Trọ 1 (Gần Trường Học)",
        price: 2500000,
        area: 20,
        contact: "0901.234.567 (Chú Năm Chủ Trọ)",
        img: "phong1.jpg",
        desc: "Phòng có gác lửng, toilet riêng, giờ giấc tự do, có wifi tốc độ cao miễn phí phù hợp 2-3 bạn sinh viên ở ghép."
    },
    {
        id: 2,
        name: "Phòng Trọ 2 (Mặt Tiền Thoáng Mát)",
        price: 3000000,
        area: 25,
        contact: "0909535837 (Chú Năm Chủ Trọ)",
        img: "phong2.jpg",
        desc: "Phòng rộng rãi, cửa sổ đón gió cực mát, kệ bếp nấu ăn đầy đủ, khu vực an ninh có camera 24/7 cho công nhân viên chức."
    },
    {
        id: 3,
        name: "Phòng trọ 3 (Giá Rẻ Tiết Kiệm)",
        price: 1500000,
        area: 18,
        contact: "0908.888.999 (Quản lý KTX)",
        img: "phong3.jpg",
        desc: "Phòng tối giản đầy đủ tiện nghi, giường tầng hiện đại, bao trọn gói chi phí cơ bản, cực kỳ tối ưu cho học sinh sinh viên."
    }
];

// Hàm bổ trợ định dạng tiền tệ Việt Nam (VND)
function formatMoney(amount) {
    return amount.toLocaleString('vi-VN') + ' đ';
}

// 1. Hàm Chuyển Đổi Qua Lại Giữa Các Trang (Tabs)
function switchPage(pageId) {
    // Ẩn toàn bộ các trang hiện tại
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active-page'));

    // Bỏ trạng thái active của các nút trên menu thanh điều hướng
    const links = document.querySelectorAll('.menu-links a');
    links.forEach(link => link.classList.remove('active'));

    // Kích hoạt trang được lựa chọn
    document.getElementById(pageId).classList.add('active-page');
    
    // Đồng bộ highlight thanh menu tương ứng với trang đang hiển thị
    if (pageId === 'lobby-page' || pageId === 'detail-page') {
        document.getElementById('nav-lobby').classList.add('active');
    } else if (pageId === 'billing-page') {
        document.getElementById('nav-billing').classList.add('active');
    }
}

// 2. Render hiển thị danh sách phòng ra Sảnh chính
function renderLobby() {
    const container = document.getElementById('room-grid-container');
    if (!container) return;
    container.innerHTML = "";

    roomsData.forEach(room => {
        const card = document.createElement('div');
        card.className = "room-card";
        card.onclick = () => showRoomDetail(room.id);

        card.innerHTML = `
            <img class="room-img" src="${room.img}" alt="${room.name}">
            <div class="room-info">
                <div class="room-name">${room.name}</div>
                <div class="room-price">Giá: ${formatMoney(room.price)}/tháng</div>
                <p style="color:#666; font-size:14px; margin-bottom:10px;">Diện tích: ${room.area} m²</p>
                <span class="btn-detail">Xem chi tiết</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3. Hiển thị Trang Chi Tiết khi click vào một phòng cụ thể
function showRoomDetail(roomId) {
    const room = roomsData.find(r => r.id === roomId);
    if (!room) return;

    const container = document.getElementById('room-detail-container');
    container.innerHTML = `
        <img class="detail-img" src="${room.img}" alt="${room.name}">
        <div class="detail-content">
            <h3 style="font-size:24px; margin-bottom:15px; color:#333;">${room.name}</h3>
            <p><strong>Diện tích:</strong> ${room.area} m²</p>
            <p><strong>Giá thuê cố định:</strong> <span class="price-highlight">${formatMoney(room.price)} / tháng</span></p>
            <p><strong>Thông tin liên hệ đặt phòng:</strong> <span style="color:#2ecc71; font-weight:bold;">${room.contact}</span></p>
            <p style="margin-top:15px; color:#555; line-height:1.6; background:#f5f5f5; padding:15px; border-radius:8px;">
                <strong>Mô tả thêm:</strong> ${room.desc}
            </p>
            <button class="btn-calc" style="margin-top:20px; background:#2ecc71;" onclick="goToBillingWithRoom(${room.id})">
                Tính tiền hóa đơn cho phòng này
            </button>
        </div>
    `;
    switchPage('detail-page');
}

// 4. Khởi tạo danh sách lựa chọn trong Hóa đơn
function initInvoiceForm() {
    const select = document.getElementById('room-select');
    if (!select) return;
    select.innerHTML = "";
    
    roomsData.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.innerText = room.name;
        select.appendChild(option);
    });
    updateRoomPriceInForm();
}

// Cập nhật hiển thị giá tiền thuê cố định khi thay đổi thẻ select phòng
function updateRoomPriceInForm() {
    const selectElement = document.getElementById('room-select');
    if(!selectElement) return;
    
    const roomId = parseInt(selectElement.value);
    const room = roomsData.find(r => r.id === roomId);
    if (room) {
        document.getElementById('form-room-price').value = room.price.toLocaleString('vi-VN');
    }
}

// Chuyển thẳng tới tab hóa đơn kèm theo việc chọn đúng mã phòng được yêu cầu
function goToBillingWithRoom(roomId) {
    const selectElement = document.getElementById('room-select');
    if(selectElement) {
        selectElement.value = roomId;
        updateRoomPriceInForm();
        switchPage('billing-page');
    }
}

// 5. Tính toán tiền điện nước cuối tháng và in kết quả thành tiền
function calculateTotal() {
    const roomId = parseInt(document.getElementById('room-select').value);
    const room = roomsData.find(r => r.id === roomId);
    if (!room) return;
    
    const powerNum = parseFloat(document.getElementById('power-num').value) || 0;
    const waterNum = parseFloat(document.getElementById('water-num').value) || 0;

    // Định nghĩa đơn giá cố định
    const POWER_PRICE = 3500;   // 3.500đ / kWh
    const WATER_PRICE = 15000;  // 15.000đ / khối m3

    // Tính toán thành tiền từng hạng mục
    const totalPower = powerNum * POWER_PRICE;
    const totalWater = waterNum * WATER_PRICE;
    const finalTotal = room.price + totalPower + totalWater;

    // Đổ dữ liệu xuất hóa đơn chi tiết ra giao diện
    const invoiceContent = document.getElementById('invoice-content');
    invoiceContent.innerHTML = `
        <div class="invoice-row">
            <span>Tên phòng:</span>
            <strong>${room.name}</strong>
        </div>
        <div class="invoice-row">
            <span>Tiền phòng cố định:</span>
            <span>${formatMoney(room.price)}</span>
        </div>
        <div class="invoice-row">
            <span>Tiền điện (${powerNum} kWh x 3.500đ):</span>
            <span>${formatMoney(totalPower)}</span>
        </div>
        <div class="invoice-row">
            <span>Tiền nước (${waterNum} m³ x 15.000đ):</span>
            <span>${formatMoney(totalWater)}</span>
        </div>
        <div class="invoice-row total-row">
            <span>TỔNG TIỀN PHẢI ĐÓNG:</span>
            <span>${formatMoney(finalTotal)}</span>
        </div>
    `;

    // Hiển thị khung chứa hóa đơn ẩn lúc trước lên màn hình
    document.getElementById('invoice-box').style.display = 'block';
}

// Kích hoạt chạy khởi tạo dữ liệu ngay sau khi trình duyệt load xong toàn bộ tài nguyên cấu trúc trang
window.onload = function() {
    renderLobby();
    initInvoiceForm();
}
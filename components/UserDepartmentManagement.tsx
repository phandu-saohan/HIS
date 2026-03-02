import React, { useState, useMemo } from 'react';
import { type UserRole, type Staff, type Department } from '../types';
import { mockUsers } from '../data/mockData';
import { Search, Plus, Edit, Trash2, Shield, Users, Building2, CheckCircle, XCircle, X } from 'lucide-react';

// Vietnam Healthcare Standard Roles
const VN_HEALTHCARE_ROLES = [
  'Giám đốc / Ban Giám đốc',
  'Trưởng khoa / Phụ trách khoa',
  'Bác sĩ điều trị',
  'Điều dưỡng trưởng',
  'Điều dưỡng viên',
  'Kỹ thuật viên',
  'Dược sĩ',
  'Nhân viên tiếp đón',
  'Kế toán / Viện phí',
  'Quản trị hệ thống',
  'Nhân viên Hành chính / Nhân sự'
];

// Vietnam Healthcare Standard Departments
const VN_HEALTHCARE_DEPARTMENTS = [
  { id: 'KKB', name: 'Khoa Khám bệnh', type: 'Lâm sàng' },
  { id: 'KCC', name: 'Khoa Cấp cứu', type: 'Lâm sàng' },
  { id: 'KNT', name: 'Khoa Nội tổng hợp', type: 'Lâm sàng' },
  { id: 'KNG', name: 'Khoa Ngoại tổng hợp', type: 'Lâm sàng' },
  { id: 'KPS', name: 'Khoa Phụ sản', type: 'Lâm sàng' },
  { id: 'KNH', name: 'Khoa Nhi', type: 'Lâm sàng' },
  { id: 'KXN', name: 'Khoa Xét nghiệm', type: 'Cận lâm sàng' },
  { id: 'KCD', name: 'Khoa Chẩn đoán hình ảnh', type: 'Cận lâm sàng' },
  { id: 'KDU', name: 'Khoa Dược', type: 'Cận lâm sàng' },
  { id: 'PKH', name: 'Phòng Kế hoạch tổng hợp', type: 'Chức năng' },
  { id: 'PTC', name: 'Phòng Tài chính kế toán', type: 'Chức năng' },
  { id: 'PTB', name: 'Phòng Tổ chức cán bộ', type: 'Chức năng' },
  { id: 'PHC', name: 'Phòng Hành chính quản trị', type: 'Chức năng' },
  { id: 'PCT', name: 'Phòng Công nghệ thông tin', type: 'Chức năng' }
];

type Tab = 'users' | 'departments' | 'roles';

interface UserDepartmentManagementProps {
  currentUserRole: UserRole;
  users: Staff[];
  departments: Department[];
  onAddUser: (data: Omit<Staff, 'id'>) => void;
  onUpdateUser: (data: Staff) => void;
  onDeleteUser: (id: string) => void;
}

const UserDepartmentManagement: React.FC<UserDepartmentManagementProps> = ({ 
  currentUserRole,
  users,
  departments,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  
  // Check if user has permission to view/edit this module
  const hasPermission = ['Quản trị Hệ thống', 'Quản lý', 'Nhân viên Nhân sự (HR)'].includes(currentUserRole);

  if (!hasPermission) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Không có quyền truy cập</h2>
        <p className="text-gray-600 dark:text-gray-400">Bạn không có quyền truy cập vào module Quản lý Người dùng & Phòng ban.</p>
      </div>
    );
  }

  return (
    <div className="modern-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <Shield className="w-6 h-6 mr-2 text-blue-600" />
          Quản lý Người dùng & Phân quyền
        </h2>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Người dùng
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'departments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Phòng ban / Khoa
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'roles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="w-4 h-4 mr-2" />
            Vai trò & Phân quyền
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'users' && <UsersTab users={users} departments={departments} onAdd={onAddUser} onUpdate={onUpdateUser} onDelete={onDeleteUser} />}
        {activeTab === 'departments' && <DepartmentsTab departments={departments} users={users} />}
        {activeTab === 'roles' && <RolesTab />}
      </div>
    </div>
  );
};

const UsersTab: React.FC<{ 
  users: Staff[], 
  departments: Department[],
  onAdd: (data: Omit<Staff, 'id'>) => void,
  onUpdate: (data: Staff) => void,
  onDelete: (id: string) => void
}> = ({ users, departments, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Staff | null>(null);

  const [formData, setFormData] = useState<Partial<Staff>>({
    name: '',
    email: '',
    contact: '',
    role: 'Bác sĩ/Y sĩ',
    status: 'Online'
  });

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleOpenModal = (user?: Staff) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        contact: '',
        role: 'Bác sĩ/Y sĩ',
        qualifications: '',
        status: 'Online'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdate({ ...editingUser, ...formData } as Staff);
    } else {
      onAdd(formData as Omit<Staff, 'id'>);
    }
    handleCloseModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Họ và tên</th>
              <th className="px-6 py-3">Vai trò</th>
              <th className="px-6 py-3">Trình độ/Chuyên môn</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">{user.qualifications}</td>
                <td className="px-6 py-4">
                  {user.status === 'Online' ? (
                    <span className="flex items-center text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" /> Online
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-500 text-sm font-medium">
                      <XCircle className="w-4 h-4 mr-1" /> Offline
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  <button 
                    onClick={() => handleOpenModal(user)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400" 
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => { if(window.confirm('Xóa người dùng này?')) onDelete(user.id); }}
                    className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-blue-400" 
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vai trò</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Staff['role'] })}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Bác sĩ/Y sĩ">Bác sĩ/Y sĩ</option>
                    <option value="Điều dưỡng">Điều dưỡng</option>
                    <option value="Kỹ thuật viên">Kỹ thuật viên</option>
                    <option value="Nhân viên Viện phí/Kế toán">Nhân viên Viện phí/Kế toán</option>
                    <option value="Quản trị Hệ thống">Quản trị Hệ thống</option>
                    <option value="Nhân viên Nhân sự (HR)">Nhân viên Nhân sự (HR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trình độ/Chuyên môn</label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Online' | 'Offline' })}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingUser ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const DepartmentsTab: React.FC<{ departments: Department[], users: Staff[] }> = ({ departments, users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepts = useMemo(() => {
    return departments.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Lâm sàng': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Cận lâm sàng': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Chức năng': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Tìm kiếm khoa/phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Khoa/Phòng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepts.map(dept => (
          <div key={dept.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{dept.name}</h3>
                <p className="text-sm text-gray-500 font-mono">Mã: {dept.id}</p>
              </div>
              <div className="flex space-x-1">
                <button className="text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getTypeColor(dept.type || 'Chức năng')}`}>
                {dept.type || 'Chức năng'}
              </span>
              <span className="text-sm text-gray-500 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {users.filter(u => u.department === dept.id || u.department === dept.name).length} nhân sự
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RolesTab: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Danh sách Vai trò & Quyền hạn (Theo chuẩn BYT)</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Tạo vai trò mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VN_HEALTHCARE_ROLES.map((role, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-bold text-gray-900 dark:text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                {role}
              </h4>
              <button className="text-sm text-blue-600 hover:underline">Chỉnh sửa quyền</button>
            </div>
            
            <div className="space-y-2 mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">Quyền hạn mặc định:</p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 pl-5 list-disc">
                {role.includes('Giám đốc') && (
                  <>
                    <li>Xem toàn bộ báo cáo thống kê bệnh viện</li>
                    <li>Phê duyệt các quyết định quan trọng</li>
                    <li>Quản lý nhân sự cấp cao</li>
                  </>
                )}
                {role.includes('Trưởng khoa') && (
                  <>
                    <li>Quản lý nhân sự trong khoa</li>
                    <li>Phê duyệt lịch trực, chấm công</li>
                    <li>Xem báo cáo hoạt động của khoa</li>
                    <li>Duyệt bệnh án xuất viện</li>
                  </>
                )}
                {role.includes('Bác sĩ') && (
                  <>
                    <li>Khám bệnh, kê đơn, chỉ định CLS</li>
                    <li>Lập bệnh án điện tử (EMR)</li>
                    <li>Xem lịch sử khám bệnh của bệnh nhân</li>
                  </>
                )}
                {role.includes('Điều dưỡng') && (
                  <>
                    <li>Thực hiện y lệnh của bác sĩ</li>
                    <li>Chăm sóc bệnh nhân nội trú</li>
                    <li>Cập nhật sinh hiệu, phiếu chăm sóc</li>
                  </>
                )}
                {role.includes('Kỹ thuật viên') && (
                  <>
                    <li>Tiếp nhận chỉ định CLS</li>
                    <li>Thực hiện xét nghiệm / chụp chiếu</li>
                    <li>Nhập kết quả CLS</li>
                  </>
                )}
                {role.includes('Dược sĩ') && (
                  <>
                    <li>Quản lý kho dược, vật tư y tế</li>
                    <li>Cấp phát thuốc theo đơn</li>
                    <li>Cảnh báo tương tác thuốc</li>
                  </>
                )}
                {role.includes('tiếp đón') && (
                  <>
                    <li>Đăng ký khám bệnh</li>
                    <li>Phân luồng bệnh nhân</li>
                    <li>Quản lý thông tin hành chính bệnh nhân</li>
                  </>
                )}
                {role.includes('Kế toán') && (
                  <>
                    <li>Thu tạm ứng, thanh toán viện phí</li>
                    <li>Quyết toán BHYT</li>
                    <li>Xuất hóa đơn điện tử</li>
                  </>
                )}
                {role.includes('Quản trị') && (
                  <>
                    <li>Quản lý toàn bộ hệ thống</li>
                    <li>Phân quyền người dùng</li>
                    <li>Cấu hình danh mục dùng chung</li>
                  </>
                )}
                {role.includes('Nhân sự') && (
                  <>
                    <li>Quản lý hồ sơ nhân viên</li>
                    <li>Chấm công, tính lương</li>
                    <li>Quản lý đào tạo</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDepartmentManagement;

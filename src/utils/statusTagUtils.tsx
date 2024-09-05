import { Tag } from 'antd';

export const getStatusTag = (status: string) => {
  let color;
  switch (status) {
    case 'new':
      color = 'blue'; // Màu xanh lam cho trạng thái mới
      break;
    case 'waiting_approve':
      color = 'gold'; // Màu vàng cho trạng thái chờ phê duyệt
      break;
    case 'approve':
      color = 'green'; // Màu xanh lá cho trạng thái phê duyệt
      break;
    case 'reject':
      color = 'volcano'; // Màu đỏ núi lửa cho trạng thái từ chối
      break;
    case 'active':
      color = 'geekblue'; // Màu xanh đậm cho trạng thái hoạt động
      break;
    case 'inactive':
      color = 'gray'; // Màu xám cho trạng thái không hoạt động
      break;
    case 'request_paid':
      color = 'yellow';
      break;
    case 'request_payout':
      color = 'yellow';
      break;
    case 'completed':
      color = 'green';
      break;
    case 'rejected':
      color = 'red'; // Màu đỏ núi lửa cho trạng thái từ chối
      break;
    default:
      color = 'blue'; // Màu xanh lam cho các trạng thái không xác định
      break;
  }
  return <Tag color={color}>{status.toUpperCase()}</Tag>;
};

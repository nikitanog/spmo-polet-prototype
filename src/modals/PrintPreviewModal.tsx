import { Modal, Button, Typography, Space, message } from 'antd';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface PrintPreviewModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PrintPreviewModal({ open, onClose }: PrintPreviewModalProps) {
  const handlePrint = () => {
    message.success('Печать отправлена на принтер по умолчанию');
    onClose();
  };

  return (
    <Modal
      title="Предпросмотр печати"
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
        <div style={{
          border: '1px solid #d9d9d9', borderRadius: 4, padding: 24, background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <Text strong style={{ fontSize: 14 }}>СПМО «ПОЛЁТ» v5 — Таблица значений параметров</Text>
            <div style={{ color: '#888', fontSize: 11 }}>Дата: {new Date().toLocaleDateString('ru-RU')}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ border: '1px solid #d9d9d9', padding: '4px 8px', textAlign: 'right' }}>Время</th>
                <th style={{ border: '1px solid #d9d9d9', padding: '4px 8px', textAlign: 'right' }}>V_приборная_км_ч</th>
                <th style={{ border: '1px solid #d9d9d9', padding: '4px 8px', textAlign: 'right' }}>V_истинная_км_ч</th>
                <th style={{ border: '1px solid #d9d9d9', padding: '4px 8px', textAlign: 'right' }}>Крен_град</th>
                <th style={{ border: '1px solid #d9d9d9', padding: '4px 8px', textAlign: 'right' }}>Тангаж_град</th>
              </tr>
            </thead>
            <tbody>
              {[0, 50, 100, 150, 200].map((t) => (
                <tr key={t}>
                  <td style={{ border: '1px solid #d9d9d9', padding: '3px 8px', textAlign: 'right' }}>{t}</td>
                  <td style={{ border: '1px solid #d9d9d9', padding: '3px 8px', textAlign: 'right' }}>{(Math.random() * 200 - 100).toFixed(2)}</td>
                  <td style={{ border: '1px solid #d9d9d9', padding: '3px 8px', textAlign: 'right' }}>{(Math.random() * 200 - 100).toFixed(2)}</td>
                  <td style={{ border: '1px solid #d9d9d9', padding: '3px 8px', textAlign: 'right' }}>{(Math.random() * 200 - 100).toFixed(2)}</td>
                  <td style={{ border: '1px solid #d9d9d9', padding: '3px 8px', textAlign: 'right' }}>{(Math.random() * 200 - 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'center', marginTop: 12, color: '#888', fontSize: 10 }}>
            Страница 1 из 24 (показаны первые 5 строк из 500)
          </div>
        </div>
        <Space style={{ justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Закрыть</Button>
          <Button icon={<DownloadOutlined />}>Экспорт PDF</Button>
          <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>Печать</Button>
        </Space>
      </div>
    </Modal>
  );
}

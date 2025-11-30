import { CalendarOutlined, SmileOutlined } from '@ant-design/icons';
import { Card, DatePicker } from 'antd';

function Home() {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Home</h1>
                <p className="text-gray-500">Welcome to your application</p>
            </div>

            <Card className="shadow-lg border-0 rounded-xl mb-6 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2563eb] to-[#9333ea] rounded-xl flex items-center justify-center">
                        <SmileOutlined className="text-white text-xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-6">Noor</div>
                <div className="flex items-center gap-2 mb-4">
                    <CalendarOutlined className="text-[#2563eb]" />
                    <span className="text-gray-700 font-medium">Select a date:</span>
                </div>
                <DatePicker
                    size="large"
                    className="w-full rounded-lg"
                />
            </Card>

            <Card className="shadow-lg border-0 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Navigation</h3>
                <p className="text-gray-600 leading-relaxed">
                    The application features a modern design with a clean interface and smooth user experience.
                </p>
            </Card>
        </div>
    );
}

export default Home;


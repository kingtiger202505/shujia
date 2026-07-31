import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Trash2 } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetData = () => {
    if (window.confirm('确定要清空本地缓存重置应用状态吗？重置后将自动刷新页面恢复正常使用。')) {
      try {
        localStorage.clear();
      } catch (e) {
        console.error(e);
      }
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-rose-100 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">应用遇到了意外小状况</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                可能是由于本地状态或数据兼容导致。别担心，点击下方按钮刷新或重置数据即可恢复使用！
              </p>
            </div>

            {this.state.error && (
              <div className="bg-rose-50 p-3 rounded-2xl text-left text-[11px] font-mono text-rose-800 max-h-32 overflow-y-auto break-all border border-rose-200">
                {this.state.error.message || '未知运行错误'}
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>刷新重试</span>
              </button>

              <button
                onClick={this.handleResetData}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-2xl text-xs transition-all"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>重置本地数据并刷新</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

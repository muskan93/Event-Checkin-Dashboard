import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'react-toastify';
import { qrApi, customersApi } from '../../api';
import StatusBadge from '../../components/StatusBadge';
import './QrScanner.css';

export default function QrScanner() {
  const [manualCode, setManualCode] = useState('');
  const [verifiedCustomer, setVerifiedCustomer] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch {
        // scanner may not be running
      }
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  };

  const verifyQrCode = async (code) => {
    setError(null);
    setVerifiedCustomer(null);
    try {
      const { data } = await qrApi.verify(code.trim());
      setVerifiedCustomer(data.customer);
      toast.success('QR code verified successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid QR code';
      setError(msg);
      if (err.response?.data?.customer) {
        setVerifiedCustomer(err.response.data.customer);
      }
      toast.error(msg);
    }
  };

  const startScanner = async () => {
    setError(null);
    setVerifiedCustomer(null);
    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopScanner();
          verifyQrCode(decodedText);
        },
        () => {}
      );
      setScanning(true);
    } catch {
      toast.error('Unable to access camera. Use manual entry instead.');
    }
  };

  const handleCheckIn = async () => {
    if (!verifiedCustomer) return;
    setCheckingIn(true);
    try {
      const { data } = await customersApi.checkIn(verifiedCustomer.qrCode);
      setVerifiedCustomer(data.customer);
      toast.success('Customer checked in successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleManualVerify = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      toast.error('Please enter a QR code');
      return;
    }
    verifyQrCode(manualCode);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="qr-scanner-page">
      <div className="page-header">
        <h1>QR Code Scanner</h1>
        <p>Scan or enter QR code to verify and check in customers</p>
      </div>

      <div className="scanner-grid">
        <div className="scanner-card">
          <h2>Camera Scanner</h2>
          <div id="qr-reader" ref={scannerRef} className="qr-reader" />
          <div className="scanner-actions">
            {!scanning ? (
              <button type="button" className="btn btn-primary" onClick={startScanner}>
                Start Scanner
              </button>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={stopScanner}>
                Stop Scanner
              </button>
            )}
          </div>
        </div>

        <div className="scanner-card">
          <h2>Manual Entry</h2>
          <form onSubmit={handleManualVerify} className="manual-form">
            <div className="form-group">
              <label htmlFor="manualCode">QR Code</label>
              <input
                id="manualCode"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. QR-EVT-001"
              />
            </div>
            <button type="submit" className="btn btn-primary">Verify QR Code</button>
          </form>
          <div className="sample-codes">
            <p>Sample codes for testing:</p>
            <code>QR-EVT-001</code> (unused) · <code>QR-EVT-002</code> (used)
          </div>
        </div>
      </div>

      {error && (
        <div className="scan-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {verifiedCustomer && (
        <div className="verified-card">
          <h2>Customer Details</h2>
          <div className="verified-grid">
            <div><span className="label">Name</span><span>{verifiedCustomer.name}</span></div>
            <div><span className="label">Mobile</span><span>{verifiedCustomer.mobile}</span></div>
            <div><span className="label">Email</span><span>{verifiedCustomer.email}</span></div>
            <div><span className="label">Project</span><span>{verifiedCustomer.projectName}</span></div>
            <div><span className="label">QR Code</span><code className="qr-code">{verifiedCustomer.qrCode}</code></div>
            <div><span className="label">Status</span><StatusBadge status={verifiedCustomer.eventStatus} /></div>
          </div>
          {!verifiedCustomer.qrUsed && verifiedCustomer.eventStatus !== 'Checked-In' && (
            <button
              type="button"
              className="btn btn-primary btn-checkin"
              onClick={handleCheckIn}
              disabled={checkingIn}
            >
              {checkingIn ? 'Checking in...' : 'Check In Customer'}
            </button>
          )}
          {verifiedCustomer.qrUsed && (
            <div className="already-checked">
              ✅ This customer has already been checked in
            </div>
          )}
        </div>
      )}
    </div>
  );
}

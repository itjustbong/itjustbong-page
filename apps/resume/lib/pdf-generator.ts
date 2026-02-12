"use client";

import { toPng, toJpeg } from "html-to-image";
import jsPDF from "jspdf";

interface PdfGeneratorOptions {
  filename?: string;
  scale?: number;
  margin?: number;
  imageQuality?: number;
  imageFormat?: "JPEG" | "PNG";
}

/**
 * PDF 페이지 브레이크 마커를 찾아 페이지 분할 지점 계산
 * HTML에 data-page-break 속성이 있는 요소를 기준으로 페이지를 나눔
 */
function getPageBreakPoints(
  element: HTMLElement,
  contentHeight: number,
  elementWidth: number,
  contentWidth: number
): number[] {
  const breakPoints: number[] = [0]; // 첫 페이지 시작
  const markers = element.querySelectorAll("[data-page-break]");
  
  // 픽셀 -> PDF mm 변환 비율
  const pxToMm = contentWidth / elementWidth;
  
  markers.forEach((marker) => {
    if (marker instanceof HTMLElement) {
      // 마커의 상대 위치 (픽셀)
      const offsetTop = marker.offsetTop;
      // mm 단위로 변환
      const positionInMm = offsetTop * pxToMm;
      
      // 마커 위치가 유효한 경우에만 추가
      if (positionInMm > breakPoints[breakPoints.length - 1]) {
        breakPoints.push(positionInMm);
      }
    }
  });
  
  return breakPoints;
}

export async function generatePdf(
  element: HTMLElement,
  options: PdfGeneratorOptions = {}
): Promise<void> {
  const {
    filename = "resume.pdf",
    scale = 1.5,
    margin = 5,
    imageQuality = 0.85,
    imageFormat = "JPEG",
  } = options;

  // A4 dimensions in mm
  const a4Width = 210;
  const a4Height = 297;

  // Calculate content area (A4 minus margins)
  const contentWidth = a4Width - margin * 2;
  const contentHeight = a4Height - margin * 2;

  // 요소 복제하여 작업 (원본 보존)
  const clone = element.cloneNode(true) as HTMLElement;
  
  // 복제본 스타일 설정
  clone.style.display = "block";
  clone.style.position = "fixed";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.width = "896px";
  clone.style.visibility = "visible";
  clone.style.zIndex = "-9999";
  clone.style.backgroundColor = "#ffffff";
  clone.style.color = "#1a1a1a";
  
  // DOM에 추가
  document.body.appendChild(clone);

  // Wait for render
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    // 페이지 브레이크 포인트 계산 (마커 기반)
    const manualBreakPoints = getPageBreakPoints(clone, contentHeight, 896, contentWidth);
    const hasManualBreaks = manualBreakPoints.length > 1;

    // html-to-image로 이미지 생성 (oklch 색상 지원)
    const captureOptions = {
      width: 896,
      height: clone.scrollHeight,
      pixelRatio: scale,
      backgroundColor: "#ffffff",
      quality: imageQuality,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
      filter: (node: HTMLElement): boolean => {
        // 숨겨진 요소 제외
        if (node instanceof HTMLElement) {
          const style = window.getComputedStyle(node);
          if (
            style.display === "none" ||
            style.visibility === "hidden"
          ) {
            return false;
          }
        }
        return true;
      },
    };

    const dataUrl =
      imageFormat === "JPEG"
        ? await toJpeg(clone, captureOptions)
        : await toPng(clone, captureOptions);

    // 이미지 로드
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = dataUrl;
    });

    // Calculate dimensions
    const imgWidth = contentWidth;
    const imgHeight = (img.height * contentWidth) / img.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // 캔버스 생성하여 이미지 분할
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }

    // 페이지 분할 지점 결정
    let pageBreaks: number[];
    
    if (hasManualBreaks) {
      // 수동 페이지 브레이크 사용
      pageBreaks = [...manualBreakPoints];
      // 마지막 페이지 끝 추가
      if (pageBreaks[pageBreaks.length - 1] < imgHeight) {
        pageBreaks.push(imgHeight);
      }
    } else {
      // 자동 페이지 분할 (기존 로직)
      const totalPages = Math.ceil(imgHeight / contentHeight);
      pageBreaks = Array.from({ length: totalPages + 1 }, (_, i) => 
        Math.min(i * contentHeight, imgHeight)
      );
    }

    // 각 페이지 렌더링
    for (let i = 0; i < pageBreaks.length - 1; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const pageStartMm = pageBreaks[i];
      const pageEndMm = pageBreaks[i + 1];
      const pageHeightMm = pageEndMm - pageStartMm;

      // mm -> 캔버스 픽셀 변환
      const sourceY = (pageStartMm * canvas.width) / contentWidth;
      const sourceHeight = (pageHeightMm * canvas.width) / contentWidth;

      // Create a temporary canvas for this page's content
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(sourceHeight, canvas.height - sourceY);

      const pageCtx = pageCanvas.getContext("2d");
      if (pageCtx) {
        pageCtx.fillStyle = "#ffffff";
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height
        );
      }

      const mimeType =
        imageFormat === "JPEG" ? "image/jpeg" : "image/png";
      const pageImgData = pageCanvas.toDataURL(
        mimeType,
        imageFormat === "JPEG" ? imageQuality : 1.0
      );
      const pageImgHeight =
        (pageCanvas.height * contentWidth) / canvas.width;

      pdf.addImage(
        pageImgData,
        imageFormat,
        margin,
        margin,
        imgWidth,
        pageImgHeight
      );
    }

    pdf.save(filename);
  } finally {
    // 복제본 제거
    document.body.removeChild(clone);
  }
}

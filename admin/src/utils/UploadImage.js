/* eslint-disable react-hooks/exhaustive-deps */
import { Upload, Button, Modal } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import fileService from "../services/file";
import React, { useEffect, useState } from "react";
import util from "./util";

export default function UploadImage({
    value = [],
    uploadButton = <Button className="upload-button" icon={<UploadOutlined />} ></Button>,
    count = 1,
    cropImage = null,
    disabled = false,
    classs,
    onChange,
    ...others
}) {
    const [fileList, setFileList] = useState([...util.getFileFormat(value)]);
    let allFiles = [...util.getFileFormat(value)];
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    
    useEffect(() => {
        setFileList([...util.getFileFormat(value)]);
        allFiles = [...util.getFileFormat(value)];
    }, [value]);

    const customRequest = async options => {
        const { onSuccess, onError, file, onProgress } = options;

        const fmData = new FormData();
        const config = { onUploadProgress: event => { onProgress({ percent: (event.loaded / event.total) * 100 }); } };
        fmData.append("file", file);
        try {
            fileService.save(fmData, config).then(res => {
                onSuccess("Ok");
                allFiles = [...allFiles, { uid: res.data.uid, url: res.data.url, name: res.data.name, percent: 33 }];
                // setFileList([...fileList, { uid: res.data.uid, url: res.data.url, name: res.data.name, percent: 33, }]);
                if (onChange && typeof onChange == 'function') {
                    onChange([...allFiles?.map(v => v.url)]);
                }
            })
        } catch (err) {
            onError({ err });
        }
    };

    const handleOnChange = (file) => { };
    const handleRemove = (file) => {
        fileService.remove({ url: file.url }).then(res => {
            setFileList(fileList?.filter(v => v.uid !== file.uid));
            onChange(fileList?.filter(v => v.uid !== file.uid)?.map(v => v.url));
        })
    };

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await util.toBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    if (cropImage) {
        if (typeof cropImage !== typeof {}) {
            cropImage = {};
        }
        cropImage.aspect = cropImage.aspect || 1;
        cropImage.shape = cropImage.shape || 'rect';
        cropImage.quality = cropImage.quality || 1;
        return (
            <ImgCrop rotate aspect shape={cropImage.shape} quality={cropImage.quality} >
                <Upload
                    accept="image/*"
                    customRequest={customRequest}
                    onChange={handleOnChange}
                    onRemove={handleRemove}
                    fileList={fileList}
                    className="image-upload-grid"
                    {...{ ...others }}
                >
                    {
                        fileList?.length >= count
                            ? null
                            : uploadButton
                    }
                </Upload>
            </ImgCrop>
        );
    } else {
        return (<>

            <Upload
                accept="image/*"
                customRequest={customRequest}
                onChange={handleOnChange}
                onRemove={handleRemove}
                fileList={fileList}
                className={classs}
                onPreview={handlePreview}
                {...{ ...others }}
            >
                {
                    fileList?.length >= count
                        ? null
                        : uploadButton
                }
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </>)
    }

};
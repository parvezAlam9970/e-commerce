import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import fileService from "../services/file";

export default function App({ value = "", onChange }) {
	const editorRef = useRef(null);

	return (
		<>
			<Editor
				tinymceScriptSrc={"https://cdn.tiny.cloud/1/dbtxkjylwn6opu7312njvi0vx674kx2b6gilzpnjait0kadl/tinymce/5/tinymce.min.js"}
				onInit={(evt, editor) => editorRef.current = editor}
				initialValue={value}
				init={{
					height: 500,
					menubar: false,
					plugins: [
						'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
						'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
						'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
					],
					toolbar: 'undo redo | blocks | ' +
						'bold italic forecolor | alignleft aligncenter ' +
						'alignright alignjustify | bullist numlist outdent indent | ' +
						'removeformat | help',
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
					ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
					plugins: 'toc print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable export',
					menubar: 'file edit view insert format tools table tc help',
					toolbar: 'undo redo | toc | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
					autosave_ask_before_unload: true,
					autosave_interval: '30s',
					autosave_prefix: '{path}{query}-{id}-',
					autosave_restore_when_empty: false,
					autosave_retention: '2m',
					image_advtab: true,
					link_list: [
						{ title: 'My page 1', value: 'https://www.tiny.cloud' },
						{ title: 'My page 2', value: 'http://www.moxiecode.com' }
					],
					image_list: [
						{ title: 'My page 1', value: 'https://www.tiny.cloud' },
						{ title: 'My page 2', value: 'http://www.moxiecode.com' }
					],
					image_class_list: [
						{ title: 'None', value: '' },
						{ title: 'Some class', value: 'class-name' }
					],
					importcss_append: true,
					templates: [
						{ title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
						{ title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
						{ title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
					],
					template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
					template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
					height: 600,
					image_caption: true,
					quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
					noneditable_noneditable_class: 'mceNonEditable',
					toolbar_mode: 'sliding',
					spellchecker_ignore_list: ['Ephox', 'Moxiecode'],
					tinycomments_mode: 'embedded',
					content_style: '.mymention{ color: gray; }',
					contextmenu: 'link image imagetools table configurepermanentpen',
					a11y_advanced_options: true,
					mentions_selector: '.mymention',
					mentions_item_type: 'profile',
					font_formats: "Montserrat=Montserrat; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
					content_style: [
						"@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');",
					],
					file_picker_callback: function (cb, value, meta) {
						const input = document.createElement("input");
						input.setAttribute("type", "file");
						input.setAttribute("accept", "image/*");
						input.onchange = function () {
							const file = this.files[0];
							const fmData = new FormData();
							fmData.append("file", file);
							try {
								fileService.save(fmData).then(res => {
									cb(res.data.url, { title: res.data.name }); 
								})
							} catch (err) {}
						};
						input.click();
					},
				}}
				onSelectionChange={() => {
					if (editorRef.current) {
						onChange(editorRef.current.getContent())
					}
				}}
			/>
		</>
	);
}
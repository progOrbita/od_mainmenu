<?php

declare(strict_types=1);

class Od_MenuTopLinks
{
    public static function get(int $id_linksmenutop, int $id_lang, int $id_shop): array
    {
        $prefix = _DB_PREFIX_;
        $sql = "SELECT l.id_linksmenutop, l.new_window, s.name, ll.link, ll.label, ll.id_lang
				FROM {$prefix}linksmenutop l
				LEFT JOIN {$prefix}linksmenutop_lang ll ON l.id_linksmenutop = ll.id_linksmenutop 
                    AND ll.id_shop = $id_shop"
                    . ($id_lang > 0 ? " AND ll.id_lang = $id_lang" : '') . "
				LEFT JOIN {$prefix}shop s ON l.id_shop = s.id_shop
                WHERE l.id_shop IN (0, $id_shop)"
            . ($id_linksmenutop > 0 ? " AND l.id_linksmenutop = $id_linksmenutop" : '');

        return Db::getInstance()->executeS($sql);
    }

    public static function getLinkLang(int $id_linksmenutop, int $id_shop)
    {
        $ret = self::get($id_linksmenutop, 0, $id_shop);

        $link = [];
        $label = [];
        $new_window = false;

        foreach ($ret as $line) {
            $link[$line['id_lang']] = Tools::safeOutput($line['link']);
            $label[$line['id_lang']] = Tools::safeOutput($line['label']);
            $new_window = (bool) $line['new_window'];
        }

        return ['link' => $link, 'label' => $label, 'new_window' => $new_window];
    }

    public static function add(array $link, array $labels, bool $newWindow = false, int $id_shop): bool
    {
        $db = Db::getInstance();

        $result = $db->insert(
            'linksmenutop',
            [
                'new_window' => (int) $newWindow,
                'id_shop' => $id_shop
            ]
        );
        $id_linksmenutop = $db->Insert_ID();

        foreach ($labels as $id_lang => $label) {
            $result &= $db->insert(
                'linksmenutop_lang',
                [
                    'id_linksmenutop' => $id_linksmenutop,
                    'id_lang' => $id_lang,
                    'id_shop' => $id_shop,
                    'label' => pSQL($label),
                    'link' => pSQL($link[$id_lang])
                ]
            );
        }

        return $result;
    }

    public static function update(array $link, array $labels, bool $newWindow = false, int $id_shop, int $id_link): bool
    {
        $db = Db::getInstance();

        $result = $db->update(
            'linksmenutop',
            [
                'new_window' => (int) $newWindow,
                'id_shop' => $id_shop
            ],
            "id_linksmenutop = $id_link"
        );

        foreach ($labels as $id_lang => $label) {
            $result &= $db->update(
                'linksmenutop_lang',
                [
                    'id_shop' => $id_shop,
                    'label' => pSQL($label),
                    'link' => pSQL($link[$id_lang])
                ],
                "id_linksmenutop = $id_link AND id_lang = $id_lang"
            );
        }

        return $result;
    }

    public static function remove(int $id_linksmenutop): bool
    {
        $db = Db::getInstance();
        return $db->delete('linksmenutop', "id_linksmenutop = $id_linksmenutop")
            && $db->delete('linksmenutop_lang', "id_linksmenutop = $id_linksmenutop");
    }
}
